import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PriceLabel from '../Price/PriceLabel/PriceLabel';
import PriceList from '../Price/PriceList/PriceList';
import type { MarkerViewModel, MapViewport, NaverMapHandle } from '../../types/map';
import { getViewportFromMap } from '../../utils/naverMapAdapter';
import { loadNaverMapScript } from '../../utils/loadNaverMapScript';
import { getClusterIcons } from '../../hook/getClusterIcons';

/** NaverMap 컴포넌트 Props. */
type NaverMapProps = {
  /** 지도 초기 중심 좌표 */
  initialCenter: { lat: number; lng: number };
  /** 지도 초기 줌 레벨 */
  initialZoom: number;
  /** 렌더링할 마커 뷰모델 목록. 변경 시 마커 전체 재생성. */
  markerViewModels?: MarkerViewModel[];
  /** 팝오버(룸 목록)를 열 마커 ID. null이면 팝오버 없음. */
  openedMarkerPopoverId?: string | null;
  /** 선택된 룸이 속한 마커 ID. 해당 마커 아이콘을 active 상태로 표시. */
  selectedMarkerId?: string | null;
  /** 마커 클릭 시 호출. 마커 ID를 전달. */
  onMarkerClick?: (id: string) => void;
  /** 팝오버 내 룸 클릭 시 호출. 룸 ID를 전달. */
  onMarkerRoomClick?: (roomId: string) => void;
  /** 지도 SDK 로드 완료 후 호출. naver.maps.Map 인스턴스를 전달. */
  onLoad?: (map: naver.maps.Map) => void;
  /** idle 이벤트마다 호출. 현재 뷰포트(center + bounds)를 전달. */
  onViewportChange?: (viewport: MapViewport) => void;
  /** 드래그·줌 시작 시 호출 — 팝오버 닫기 등 외부 상태 초기화용. */
  onMapInteractionStart?: () => void;
  /** 마커가 없는 빈 지도 영역 클릭 시 호출. */
  onMapEmptyClick?: () => void;
  className?: string;
};

/** 팝오버 오버레이의 위치(px)와 표시할 룸 목록. 마커 클릭 시 생성됨. */
type ReactMarkerPopover = {
  left: number;
  top: number;
  rooms: Array<{ id: string; name: string; priceText: string }>;
};

/** PriceLabel 마커 아이콘 너비(px). 팝오버 수평 중앙 정렬 계산에 사용. */
const MARKER_WIDTH_PX = 129;
/** PriceLabel 마커 앵커 좌표(px). 아이콘 좌상단 기준 클릭 포인트 위치. */
const MARKER_ANCHOR_PX = 48;

/**
 * 네이버 지도 SDK 기반 지도 컴포넌트.
 * - markerViewModels로 PriceLabel 마커를 렌더링하고, 클릭·드래그·줌 이벤트를 상위에 전달.
 * - 복수 룸 마커 클릭 시 InfoWindow 대신 React 오버레이(PriceList) 팝오버를 표시.
 * - ref로 NaverMapHandle(panTo, setCenter, getViewport 등)을 외부에 노출.
 */
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
      onMapInteractionStart,
      onMapEmptyClick,
      className,
    },
    ref
  ) => {
    // ── DOM 및 Naver Maps 인스턴스 refs ──
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<naver.maps.Map | null>(null);

    // ── 지도 이벤트 리스너 refs (cleanup 시 removeListener에 사용) ──
    const idleListenerRef = useRef<naver.maps.MapEventListener | null>(null);
    const dragStartListenerRef = useRef<naver.maps.MapEventListener | null>(null);
    const zoomChangedListenerRef = useRef<naver.maps.MapEventListener | null>(null);
    const mapClickListenerRef = useRef<naver.maps.MapEventListener | null>(null);

    // ── 콜백 안정화 refs ──
    // 마커 클릭 리스너는 생성 시점 클로저를 캡처하므로,
    // props 콜백이 바뀌어도 항상 최신값을 참조할 수 있도록 ref에 동기화한다.
    const onLoadRef = useRef(onLoad);
    const onViewportChangeRef = useRef(onViewportChange);
    const onMapInteractionStartRef = useRef(onMapInteractionStart);
    const onMapEmptyClickRef = useRef(onMapEmptyClick);
    const onMarkerClickRef = useRef(onMarkerClick);

    // ── 마커 인스턴스 및 팝오버 상태 refs ──
    const markerInstancesRef = useRef<Map<string, naver.maps.Marker>>(new Map());
    const markerListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const prevSelectedMarkerIdRef = useRef<string | null>(null);
    /** MarkerClustering 인스턴스. markerViewModels 변경 시 재생성. */
    const clusteringRef = useRef<MarkerClustering | null>(null);
    // 마커 클릭 핸들러에서 현재 openedMarkerPopoverId를 읽기 위한 ref.
    // 클로저 생성 시점의 값을 캡처하므로 직접 prop을 참조할 수 없음.
    const openedMarkerPopoverIdRef = useRef<string | null>(null);

    const [scriptError, setScriptError] = useState<string | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    /** 현재 표시 중인 팝오버 데이터. null이면 팝오버 미표시. */
    const [reactPopover, setReactPopover] = useState<ReactMarkerPopover | null>(null);

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

    // 콜백 ref 동기화 — props가 바뀔 때마다 ref에 최신값 유지
    useEffect(() => {
      onLoadRef.current = onLoad;
    }, [onLoad]);

    useEffect(() => {
      onViewportChangeRef.current = onViewportChange;
    }, [onViewportChange]);

    useEffect(() => {
      onMapInteractionStartRef.current = onMapInteractionStart;
    }, [onMapInteractionStart]);

    useEffect(() => {
      onMapEmptyClickRef.current = onMapEmptyClick;
    }, [onMapEmptyClick]);

    useEffect(() => {
      onMarkerClickRef.current = onMarkerClick;
    }, [onMarkerClick]);

    // 네이버 지도 SDK 스크립트 로드 → 지도 인스턴스 생성 → 이벤트 리스너 등록.
    // initialCenter·initialZoom은 마운트 시 1회만 사용. props 변경 시 지도를 재생성하지 않는다.
    const initialCenterRef = useRef(initialCenter);
    const initialZoomRef = useRef(initialZoom);

    useEffect(() => {
      if (!mapContainerRef.current) return;
      // cleanup에서 ref.current를 직접 읽으면 lint 경고가 발생하므로 로컬에 캡처.
      // markerInstancesRef.current는 항상 동일한 Map 객체를 가리키므로 안전하다.
      const markerInstances = markerInstancesRef.current;

      let cancelled = false;

      loadNaverMapScript()
        .then(() => {
          if (cancelled || !mapContainerRef.current) return;
          setScriptError(null);

          const map = new naver.maps.Map(mapContainerRef.current, {
            center: new naver.maps.LatLng(initialCenterRef.current.lat, initialCenterRef.current.lng),
            zoom: initialZoomRef.current,
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

          dragStartListenerRef.current = naver.maps.Event.addListener(map, 'dragstart', () => {
            onMapInteractionStartRef.current?.();
          });
          zoomChangedListenerRef.current = naver.maps.Event.addListener(map, 'zoom_changed', () => {
            onMapInteractionStartRef.current?.();
          });

          mapClickListenerRef.current = naver.maps.Event.addListener(map, 'click', () => {
            onMapEmptyClickRef.current?.();
          });
        })
        .catch((err) => {
          if (!cancelled) {
            setScriptError(err instanceof Error ? err.message : 'Failed to load map');
          }
        });

      return () => {
        cancelled = true;

        if (clusteringRef.current) {
          clusteringRef.current.setMap(null);
          clusteringRef.current = null;
        }

        for (const listener of markerListenersRef.current) {
          naver.maps.Event.removeListener(listener);
        }
        markerListenersRef.current = [];

        for (const marker of markerInstances.values()) {
          marker.setMap(null);
        }
        markerInstances.clear();

        if (idleListenerRef.current) {
          naver.maps.Event.removeListener(idleListenerRef.current);
          idleListenerRef.current = null;
        }
        if (dragStartListenerRef.current) {
          naver.maps.Event.removeListener(dragStartListenerRef.current);
          dragStartListenerRef.current = null;
        }
        if (zoomChangedListenerRef.current) {
          naver.maps.Event.removeListener(zoomChangedListenerRef.current);
          zoomChangedListenerRef.current = null;
        }
        if (mapClickListenerRef.current) {
          naver.maps.Event.removeListener(mapClickListenerRef.current);
          mapClickListenerRef.current = null;
        }

        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
          setIsMapReady(false);
        }
        setReactPopover(null);
      };
    }, []);

    // markerViewModels 변경 시 마커 전체 재생성.
    // 단일 룸 마커: 클릭 시 바로 룸 선택.
    // 복수 룸 마커: 클릭 시 팝오버 토글.
    // MarkerClustering이 로드된 경우 클러스터링 인스턴스도 재생성.
    useEffect(() => {
      if (!isMapReady) return;

      // 이전 클러스터링 인스턴스 제거
      if (clusteringRef.current) {
        clusteringRef.current.setMap(null);
        clusteringRef.current = null;
      }

      for (const listener of markerListenersRef.current) {
        naver.maps.Event.removeListener(listener);
      }
      markerListenersRef.current = [];

      for (const marker of markerInstancesRef.current.values()) {
        marker.setMap(null);
      }
      markerInstancesRef.current.clear();

      const map = mapRef.current;
      if (!map) return;

      const models = markerViewModels ?? [];
      const markerArray: naver.maps.Marker[] = [];

      for (const model of models) {
        // MarkerClustering이 마커 가시성(setMap)을 관리하므로 map 속성 없이 생성.
        // 클러스터링 미사용 폴백 시에는 아래에서 직접 setMap을 호출한다.
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(model.lat, model.lng),
          zIndex: model.favorite === 'on' ? 1 : 0,
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
            anchor: new naver.maps.Point(MARKER_ANCHOR_PX, MARKER_ANCHOR_PX), // PriceLabel 컴포넌트 기준 앵커 위치 (좌상단으로부터 px)
          },
        });

        markerArray.push(marker);
        markerInstancesRef.current.set(model.id, marker);
        markerListenersRef.current.push(
          naver.maps.Event.addListener(marker, 'click', () => {
            if (model.rooms.length > 1) {
              if (openedMarkerPopoverIdRef.current === model.id) {
                // 이미 열린 마커 재클릭 → 팝오버 닫기
                setReactPopover(null);
              } else {
                // SDK의 map.getProjection().fromCoordToOffset()은 패닝 후 내부 캐시를
                // 즉시 갱신하지 않아 stale한 좌표를 반환한다 (줌은 projection 스케일이
                // 바뀌어 강제 재계산되므로 정상 동작).
                // → 마커 DOM 요소의 getBoundingClientRect()로 실제 화면 위치를 직접 읽는다.
                const markerEl = markerInstancesRef.current.get(model.id)?.getElement();
                if (markerEl && mapContainerRef.current) {
                  const markerRect = markerEl.getBoundingClientRect();
                  const containerRect = mapContainerRef.current.getBoundingClientRect();
                  setReactPopover({
                    // 마커 이미지 좌상단 기준 → 시각적 중앙(x), 상단에서 gap(y)으로 보정
                    left: markerRect.left - containerRect.left + MARKER_WIDTH_PX / 2,
                    top: markerRect.top - containerRect.top,
                    rooms: model.rooms.map((r) => ({ id: r.id, name: r.name, priceText: r.priceText })),
                  });
                }
              }
            }
            onMarkerClickRef.current?.(model.id);
          })
        );
      }

      // MarkerClustering 적용.
      // 클러스터링 라이브러리가 로드된 경우 MarkerClustering 인스턴스를 생성하고
      // 마커 가시성 관리를 위임한다. 미로드 시 마커를 직접 지도에 설정하여 폴백.
      if (typeof MarkerClustering !== 'undefined' && markerArray.length > 0) {
        const { htmlMarker1, htmlMarker2, htmlMarker3 } = getClusterIcons(naver.maps);
        clusteringRef.current = new MarkerClustering({
          map,
          markers: markerArray,
          minClusterSize: 2,
          // 이 줌 레벨 이상에서는 클러스터를 해제하고 개별 마커를 표시
          maxZoom: 15,
          gridSize: 120,
          disableClickZoom: false,
          icons: [htmlMarker1, htmlMarker2, htmlMarker3],
          // [5, 14] → 1~5개: htmlMarker1, 6~14개: htmlMarker2, 15개+: htmlMarker3
          indexGenerator: [5, 14],
          stylingFunction: (clusterMarker, count) => {
            const el = clusterMarker.getElement()?.querySelector('div');
            if (el) (el as HTMLElement).textContent = String(count);
          },
        });
      } else {
        // 폴백: MarkerClustering 없이 개별 마커를 지도에 직접 표시
        for (const marker of markerArray) {
          marker.setMap(map);
        }
      }
    }, [isMapReady, markerViewModels]);

    // selectedMarkerId 변경 시 이전·현재 마커 아이콘만 교체 (isActive 플래그).
    // 전체 마커를 재생성하지 않고 두 개만 갱신하여 성능 최적화.
    useEffect(() => {
      if (!isMapReady) return;

      const models = markerViewModels ?? [];
      const prev = prevSelectedMarkerIdRef.current;
      prevSelectedMarkerIdRef.current = selectedMarkerId ?? null;

      if (prev) {
        const prevMarker = markerInstancesRef.current.get(prev);
        const prevModel = models.find((m) => m.id === prev);
        if (prevMarker && prevModel) {
          prevMarker.setZIndex(prevModel.favorite === 'on' ? 1 : 0);
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
            anchor: new naver.maps.Point(MARKER_ANCHOR_PX, MARKER_ANCHOR_PX), // PriceLabel 컴포넌트 기준 앵커 위치 (좌상단으로부터 px)
          });
        }
      }

      if (selectedMarkerId) {
        const marker = markerInstancesRef.current.get(selectedMarkerId);
        const model = models.find((m) => m.id === selectedMarkerId);
        if (marker && model) {
          marker.setZIndex(10);
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
            anchor: new naver.maps.Point(MARKER_ANCHOR_PX, MARKER_ANCHOR_PX), // PriceLabel 컴포넌트 기준 앵커 위치 (좌상단으로부터 px)
          });
        }
      }
    }, [isMapReady, selectedMarkerId, markerViewModels]);

    // openedMarkerPopoverId 동기화 및 팝오버 닫기.
    // - ref 동기화: 마커 클릭 핸들러에서 현재값을 읽기 위함 (클로저 stale 방지).
    // - null로 변경 시 팝오버 닫기: 필터 변경·룸 선택 등 외부에서 팝오버를 닫을 때 호출됨.
    useEffect(() => {
      openedMarkerPopoverIdRef.current = openedMarkerPopoverId ?? null;
      if (!openedMarkerPopoverId) {
        setReactPopover(null);
      }
    }, [openedMarkerPopoverId]);

    if (scriptError) {
      return (
        <div className={className} style={{ width: '100%', height: '100%' }} role="alert" aria-live="polite">
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-600">
            <span>지도를 불러올 수 없습니다.</span>
            <span className="text-sm">{scriptError}</span>
          </div>
        </div>
      );
    }

    return (
      // position: relative — 팝오버 absolute 기준점
      <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

        {/* 룸 목록 팝오버.
            Naver Maps InfoWindow는 React 트리 밖 DOM이라 클릭 이벤트가 동작하지 않으므로,
            absolute div + React 컴포넌트로 대체.
            transform: translate(-50%, -100%) → 수평 중앙 정렬, 마커 상단에 하단 배치.
            stopPropagation → 팝오버 위 터치·클릭이 지도 이벤트로 전파되지 않도록 차단. */}
        {reactPopover && (
          <div
            className="absolute z-30"
            style={{
              left: reactPopover.left,
              top: reactPopover.top,
              transform: 'translate(-50%, -100%)',
            }}
            onMouseDown={(event) => event.stopPropagation()}
            onMouseUp={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
            <PriceList rooms={reactPopover.rooms} isOpen onRoomClick={(room) => onMarkerRoomClick?.(room.id)} />
          </div>
        )}
      </div>
    );
  }
);

NaverMap.displayName = 'NaverMap';

export default NaverMap;
