import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PriceLabel from '../Price/PriceLabel/PriceLabel';
import PriceList from '../Price/PriceList/PriceList';
import type { MapMarker, MarkerViewModel, MapViewport, NaverMapHandle } from '../../types/map';
import { getViewportFromMap } from '../../utils/naverMapAdapter';
import { loadNaverMapScript } from '../../utils/loadNaverMapScript';

/** 네이버 지도 컴포넌트 props. 초기 중심/줌, 마커·뷰모델, 팝오버·선택 상태, 콜백 등. */
type NaverMapProps = {
  initialCenter: { lat: number; lng: number };
  initialZoom: number;
  markers?: MapMarker[];
  markerViewModels?: MarkerViewModel[];
  openedMarkerPopoverId?: string | null;
  selectedMarkerId?: string | null;
  onMarkerClick?: (id: string) => void;
  onMarkerRoomClick?: (roomId: string) => void;
  onLoad?: (map: naver.maps.Map) => void;
  onViewportChange?: (viewport: MapViewport) => void;
  className?: string;
};

/** 네이버 지도 래퍼. 스크립트 로드 후 지도 생성, 마커·팝오버·뷰포트 변경 이벤트 처리. ref로 지도 인스턴스/뷰포트/panTo/setCenter 노출. */
const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(
  (
    {
      initialCenter,
      initialZoom,
      markers,
      markerViewModels,
      openedMarkerPopoverId,
      selectedMarkerId,
      onMarkerClick,
      onMarkerRoomClick,
      onLoad,
      onViewportChange,
      className,
    },
    ref
  ) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<naver.maps.Map | null>(null);
    /** 지도 idle 시 뷰포트 변경 콜백 등록용. 언마운트 시 제거. */
    const idleListenerRef = useRef<naver.maps.MapEventListener | null>(null);
    const onLoadRef = useRef(onLoad);
    const onViewportChangeRef = useRef(onViewportChange);
    const markerInstancesRef = useRef<Map<string, naver.maps.Marker>>(new Map());
    const markerListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const popoverRef = useRef<naver.maps.InfoWindow | null>(null);
    /** 팝오버 내 버튼 클릭 리스너 제거용. effect 정리 시 호출. */
    const popoverListenersRef = useRef<Array<() => void>>([]);
    const [scriptError, setScriptError] = useState<string | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    /** ref로 부모에 지도 인스턴스, getViewport, panTo, setCenter 노출. */
    useImperativeHandle(
      ref,
      () => ({
        getMap: () => mapRef.current,
        getViewport: () => {
          if (!mapRef.current) return null;
          return getViewportFromMap(mapRef.current);
        },
        panTo: (lat: number, lng: number) => {
          if (mapRef.current) {
            mapRef.current.panTo(new naver.maps.LatLng(lat, lng));
          }
        },
        setCenter: (lat: number, lng: number) => {
          if (mapRef.current) {
            mapRef.current.setCenter(new naver.maps.LatLng(lat, lng));
          }
        },
      }),
      []
    );

    useEffect(() => {
      onLoadRef.current = onLoad;
    }, [onLoad]);

    useEffect(() => {
      onViewportChangeRef.current = onViewportChange;
    }, [onViewportChange]);

    /** 네이버 지도 스크립트 로드 후 지도 생성, idle 시 onViewportChange 호출. 언마운트 시 리스너·마커·팝오버·지도 정리. */
    useEffect(() => {
      if (!mapContainerRef.current) return;

      let cancelled = false;

      loadNaverMapScript()
        .then(() => {
          if (cancelled || !mapContainerRef.current) return;
          setScriptError(null);

          const map = new naver.maps.Map(mapContainerRef.current, {
            center: new naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
            zoom: initialZoom,
            zoomControl: false,
            mapDataControl: false,
          });

          mapRef.current = map;
          setIsMapReady(true);

          const loadCb = onLoadRef.current;
          if (loadCb) loadCb(map);

          idleListenerRef.current = naver.maps.Event.addListener(map, 'idle', () => {
            const viewportCb = onViewportChangeRef.current;
            if (viewportCb) viewportCb(getViewportFromMap(map));
          });
        })
        .catch((err) => {
          if (!cancelled) {
            setScriptError(err instanceof Error ? err.message : 'Failed to load map');
          }
        });

      return () => {
        cancelled = true;

        for (const listener of markerListenersRef.current) {
          naver.maps.Event.removeListener(listener);
        }
        markerListenersRef.current = [];

        for (const marker of markerInstancesRef.current.values()) {
          marker.setMap(null);
        }
        markerInstancesRef.current.clear();

        for (const cleanup of popoverListenersRef.current) {
          cleanup();
        }
        popoverListenersRef.current = [];

        if (popoverRef.current) {
          popoverRef.current.close();
          popoverRef.current = null;
        }

        if (idleListenerRef.current) {
          naver.maps.Event.removeListener(idleListenerRef.current);
          idleListenerRef.current = null;
        }

        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
          setIsMapReady(false);
        }
      };
    }, [initialCenter.lat, initialCenter.lng, initialZoom]);

    /** markerViewModels(또는 markers) 기준으로 마커 생성/갱신. PriceLabel 커스텀 아이콘, 클릭 시 onMarkerClick. */
    useEffect(() => {
      if (!isMapReady || !mapRef.current) return;

      for (const listener of markerListenersRef.current) {
        naver.maps.Event.removeListener(listener);
      }
      markerListenersRef.current = [];

      for (const marker of markerInstancesRef.current.values()) {
        marker.setMap(null);
      }
      markerInstancesRef.current.clear();

      const map = mapRef.current;
      const fallbackMarkers = markers ?? [];
      const models =
        markerViewModels ??
        fallbackMarkers.map<MarkerViewModel>((marker) => ({
          id: marker.id,
          lat: marker.lat,
          lng: marker.lng,
          priceText: '',
          isPartial: false,
          favorite: 'off',
          isActive: marker.id === selectedMarkerId,
          extraRoomCount: 0,
          rooms: [],
        }));

      for (const model of models) {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(model.lat, model.lng),
          map,
          icon: markerViewModels
            ? {
                content: renderToStaticMarkup(
                  <PriceLabel
                    priceText={model.priceText}
                    isPartial={model.isPartial}
                    favorite={model.favorite}
                    isActive={model.isActive}
                    extraRoomCount={model.extraRoomCount}
                  />
                ),
                anchor: new naver.maps.Point(48, 48),
              }
            : undefined,
        });

        markerInstancesRef.current.set(model.id, marker);
        markerListenersRef.current.push(
          naver.maps.Event.addListener(marker, 'click', () => {
            onMarkerClick?.(model.id);
          })
        );
      }
    }, [isMapReady, markers, markerViewModels, onMarkerClick, selectedMarkerId]);

    /** openedMarkerPopoverId에 해당하는 지점에 PriceList 팝오버 표시. rooms > 1일 때만. 팝오버 내 룸 클릭 시 onMarkerRoomClick. */
    useEffect(() => {
      if (!isMapReady || !mapRef.current) return;

      for (const cleanup of popoverListenersRef.current) {
        cleanup();
      }
      popoverListenersRef.current = [];

      if (popoverRef.current) {
        popoverRef.current.close();
        popoverRef.current = null;
      }

      if (!openedMarkerPopoverId || !markerViewModels) return;

      const markerModel = markerViewModels.find((m) => m.id === openedMarkerPopoverId);
      if (!markerModel || markerModel.rooms.length <= 1) return;

      const marker = markerInstancesRef.current.get(openedMarkerPopoverId);
      if (!marker || !mapRef.current) return;

      const popoverKey = `marker-popover-${openedMarkerPopoverId}`;
      const rooms = markerModel.rooms.map((room) => ({
        id: room.id,
        name: room.name,
        priceText: room.priceText,
      }));

      const content = `
        <div data-popover-key="${popoverKey}">
          ${renderToStaticMarkup(<PriceList rooms={rooms} isOpen />)}
        </div>
      `;

      const infoWindow = new naver.maps.InfoWindow({
        content,
        borderWidth: 0,
        disableAnchor: false,
        backgroundColor: 'transparent',
      });
      popoverRef.current = infoWindow;

      const domReadyListener = naver.maps.Event.addListener(infoWindow, 'domready', () => {
        const container = document.querySelector(`[data-popover-key="${popoverKey}"]`);
        if (!container) return;

        const buttons = Array.from(container.querySelectorAll('button'));
        const removers: Array<() => void> = [];
        buttons.forEach((button, index) => {
          const room = markerModel.rooms[index];
          if (!room) return;
          const handler = () => onMarkerRoomClick?.(room.id);
          button.addEventListener('click', handler);
          removers.push(() => button.removeEventListener('click', handler));
        });
        popoverListenersRef.current.push(...removers);
      });
      markerListenersRef.current.push(domReadyListener);

      infoWindow.open(mapRef.current, marker);
    }, [isMapReady, markerViewModels, onMarkerRoomClick, openedMarkerPopoverId]);

    /** 스크립트 로드 실패 시 에러 메시지 영역 렌더. */
    if (scriptError) {
      return (
        <div
          className={className}
          style={{ width: '100%', height: '100%' }}
          role="alert"
          aria-live="polite"
        >
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-600">
            <span>지도를 불러올 수 없습니다.</span>
            <span className="text-sm">{scriptError}</span>
          </div>
        </div>
      );
    }

    return <div ref={mapContainerRef} className={className} style={{ width: '100%', height: '100%' }} />;
  }
);

NaverMap.displayName = 'NaverMap';

export default NaverMap;

