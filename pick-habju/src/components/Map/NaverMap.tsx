import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PriceLabel from '../Price/PriceLabel/PriceLabel';
import PriceList from '../Price/PriceList/PriceList';
import type { MarkerViewModel, MapViewport, NaverMapHandle } from '../../types/map';
import { getViewportFromMap } from '../../utils/naverMapAdapter';
import { loadNaverMapScript } from '../../utils/loadNaverMapScript';

/** 네이버 지도 컴포넌트 props. 초기 중심/줌, 마커·뷰모델, 팝오버·선택 상태, 콜백 등. */
type NaverMapProps = {
  initialCenter: { lat: number; lng: number };
  initialZoom: number;
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
    /** 이전 active 마커 id 추적. active 상태 전용 effect에서 이전 마커를 비활성화하는 데 사용. */
    const prevSelectedMarkerIdRef = useRef<string | null>(null);
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

    /** 
     * 팝오버 렌더 방식 (MapPage의 openedMarkerPopoverId와 연동)
     *
     * 1) openedMarkerPopoverId 감지
     *    - MapPage에서 룸 2개 이상인 마커를 클릭하면 이 값이 해당 지점 id(businessId)로 설정됨.
     *    - 이 effect는 그 값을 감지해 해당 마커에만 룸 리스트 팝오버를 붙임.
     *
     * 2) 팝오버 표시
     *    - markerViewModels에서 openedMarkerPopoverId에 해당하는 markerModel 조회.
     *    - markerInstancesRef에서 같은 id의 naver.maps.Marker 인스턴스 조회.
     *    - PriceList를 renderToStaticMarkup으로 HTML 문자열로 만든 뒤, naver.maps.InfoWindow의 content에 넣고
     *      infoWindow.open(map, marker) 로 해당 마커에 열어서 "마커 위에 리스트"가 보이게 함.
     *
     * 3) 룸 클릭 처리 (React 이벤트 아님)
     *    - InfoWindow 내용은 지도 API가 DOM으로 넣기 때문에 React 이벤트가 동작하지 않음.
     *    - InfoWindow 'domready' 이벤트 후, data-popover-key로 컨테이너를 찾고 그 안의 button들을 querySelectorAll로 찾음.
     *    - 버튼 순서와 markerModel.rooms 순서를 매핑(button index === rooms[index])해서
     *      각 버튼에 addEventListener('click', () => onMarkerRoomClick(room.id)) 로 수동 바인딩.
     *    - 바인딩 해제 함수를 popoverListenersRef에 넣어 두고, effect cleanup 또는 openedMarkerPopoverId 변경 시 제거.
    */
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
      const models = markerViewModels ?? [];

      for (const model of models) {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(model.lat, model.lng),
          map,
          icon: {
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
          },
        });

        markerInstancesRef.current.set(model.id, marker);
        markerListenersRef.current.push(
          naver.maps.Event.addListener(marker, 'click', () => {
            onMarkerClick?.(model.id);
          })
        );
      }
    }, [isMapReady, markerViewModels, onMarkerClick]);

    /**
     * 선택 마커의 active 아이콘만 교체. 마커 전체 재생성 없이 이전·신규 마커 두 개만 setIcon 호출.
     * - selectedMarkerId만 바뀔 때(룸 선택): Effect 1은 실행되지 않고 이 effect만 두 마커 아이콘 교체.
     * - markerViewModels가 바뀔 때(데이터·필터 갱신): Effect 1이 먼저 전체를 isActive:false로 재생성한 뒤
     *   이 effect가 실행되어 현재 selectedMarkerId에 active를 복원. selectedMarkerId가 null이면 복원 없음.
     */
    useEffect(() => {
      if (!isMapReady) return;

      const models = markerViewModels ?? [];
      const prev = prevSelectedMarkerIdRef.current;
      prevSelectedMarkerIdRef.current = selectedMarkerId ?? null;

      if (prev) {
        const prevMarker = markerInstancesRef.current.get(prev);
        const prevModel = models.find((m) => m.id === prev);
        if (prevMarker && prevModel) {
          prevMarker.setIcon({
            content: renderToStaticMarkup(
              <PriceLabel
                priceText={prevModel.priceText}
                isPartial={prevModel.isPartial}
                favorite={prevModel.favorite}
                isActive={false}
                extraRoomCount={prevModel.extraRoomCount}
              />
            ),
            anchor: new naver.maps.Point(48, 48),
          });
        }
      }

      if (selectedMarkerId) {
        const marker = markerInstancesRef.current.get(selectedMarkerId);
        const model = models.find((m) => m.id === selectedMarkerId);
        if (marker && model) {
          marker.setIcon({
            content: renderToStaticMarkup(
              <PriceLabel
                priceText={model.priceText}
                isPartial={model.isPartial}
                favorite={model.favorite}
                isActive={true}
                extraRoomCount={model.extraRoomCount}
              />
            ),
            anchor: new naver.maps.Point(48, 48),
          });
        }
      }
    }, [isMapReady, selectedMarkerId, markerViewModels]);

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

      /** marker icon.anchor(Point(48,48)) 기준으로 리스트를 위로 보정 */
      const SELECTED_MARKER_HEIGHT_PX = 50;
      const SELECTED_MARKER_WIDTH_PX = 129;
      const MARKER_ANCHOR_X_PX = 48;
      const LIST_TO_MARKER_GAP_PX = 10;
      const listPixelOffsetY = -(SELECTED_MARKER_HEIGHT_PX + LIST_TO_MARKER_GAP_PX);
      const listPixelOffsetX = (SELECTED_MARKER_WIDTH_PX / 2) - MARKER_ANCHOR_X_PX; // 16.5

      const infoWindow = new naver.maps.InfoWindow({
        content,
        borderWidth: 0,
        disableAnchor: true,
        pixelOffset: new naver.maps.Point(listPixelOffsetX, listPixelOffsetY),
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

