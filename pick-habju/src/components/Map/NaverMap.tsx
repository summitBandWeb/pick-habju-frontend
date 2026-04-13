import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { renderPriceMarker } from '../../utils/renderPriceMarker';
import {
  PRICE_MARKER_ANCHOR_X,
  PRICE_MARKER_ANCHOR_Y,
  PRICE_MARKER_DOT_ANCHOR_X,
  PRICE_MARKER_DOT_ANCHOR_Y,
  PRICE_MARKER_LABEL_W,
  PRICE_MARKER_LABEL_H,
} from '../Price/Marker/PriceMarker';
import type { MarkerViewModel, MapViewport, NaverMapHandle } from '../../types/map';
import { getViewportFromMap } from '../../utils/naverMapAdapter';
import { loadNaverMapScript } from '../../utils/loadNaverMapScript';
import { getClusterIcons } from '../../hook/getClusterIcons';
import { buildMarkerBox, computeMarkerLevels, getMarkerPriority } from '../../utils/markerCollisionDetector';
import type { PriceMarkerLevel } from '../../utils/markerCollisionDetector';

const NAVER_MAP_CUSTOM_STYLE_ID = '1ef1aa21-4f03-4b99-957f-7d08f5f698bb';

/** NaverMap 컴포넌트 Props. */
type NaverMapProps = {
  /** 지도 초기 중심 좌표 */
  initialCenter: { lat: number; lng: number };
  /** 지도 초기 줌 레벨 */
  initialZoom: number;
  /** 렌더링할 마커 뷰모델 목록. 변경 시 마커 전체 재생성. */
  markerViewModels?: MarkerViewModel[];
  /** 선택된 룸이 속한 마커 ID. 해당 마커 아이콘을 active 상태로 표시. */
  selectedMarkerId?: string | null;
  /** 마커 클릭 시 호출. 마커 ID를 전달. */
  onMarkerClick?: (id: string) => void;
  /** 지도 SDK 로드 완료 후 호출. naver.maps.Map 인스턴스를 전달. */
  onLoad?: (map: naver.maps.Map) => void;
  /** idle 이벤트마다 호출. 현재 뷰포트(center + bounds)를 전달. */
  onViewportChange?: (viewport: MapViewport) => void;
  /** 마커가 없는 빈 지도 영역 클릭 시 호출. */
  onMapEmptyClick?: () => void;
  className?: string;
};

/**
 * 네이버 지도 SDK 기반 지도 컴포넌트.
 * - markerViewModels로 PriceMarker 마커를 렌더링하고, 클릭·드래그·줌 이벤트를 상위에 전달.
 * - zoom ≥ 16에서 idle 이벤트마다 AABB 충돌 검사로 마커 레벨(1/2/3)을 자동 조정.
 * - 마커 클릭 시 onMarkerClick 콜백을 호출해 상위에서 캐러셀을 표시.
 * - ref로 NaverMapHandle(panTo, setCenter, getViewport 등)을 외부에 노출.
 */
const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(
  (
    {
      initialCenter,
      initialZoom,
      markerViewModels,
      selectedMarkerId,
      onMarkerClick,
      onLoad,
      onViewportChange,
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
    const mapClickListenerRef = useRef<naver.maps.MapEventListener | null>(null);

    // ── 콜백 안정화 refs ──
    // 마커 클릭 리스너는 생성 시점 클로저를 캡처하므로,
    // props 콜백이 바뀌어도 항상 최신값을 참조할 수 있도록 ref에 동기화한다.
    const onLoadRef = useRef(onLoad);
    const onViewportChangeRef = useRef(onViewportChange);
    const onMapEmptyClickRef = useRef(onMapEmptyClick);
    const onMarkerClickRef = useRef(onMarkerClick);

    // ── 마커 인스턴스 refs ──
    const markerInstancesRef = useRef<Map<string, naver.maps.Marker>>(new Map());
    const markerListenersRef = useRef<naver.maps.MapEventListener[]>([]);
    const prevSelectedMarkerIdRef = useRef<string | null>(null);
    /** MarkerClustering 인스턴스. markerViewModels 변경 시 재생성. */
    const clusteringRef = useRef<MarkerClustering | null>(null);
    /** 마커 ID → 라벨 DOM 실측 크기 캐시. 한 번 측정 후 재사용. */
    const labelSizeCacheRef = useRef<Map<string, { width: number; height: number }>>(new Map());
    /** 마커 ID → 현재 표시 레벨. idle마다 비교해 변경된 마커만 setIcon 호출. */
    const markerLevelsRef = useRef<Map<string, PriceMarkerLevel>>(new Map());
    /** idle 핸들러에서 최신 markerViewModels를 읽기 위한 ref (클로저 stale 방지). */
    const markerViewModelsRef = useRef<MarkerViewModel[]>([]);
    /** idle 핸들러에서 최신 selectedMarkerId를 읽기 위한 ref. */
    const selectedMarkerIdRef = useRef<string | null>(null);
    /**
     * 충돌 감지 + 마커 레벨 업데이트 함수 ref.
     * 지도 초기화 완료 후 설정되며, markerViewModels 변경 시에도 직접 호출해
     * idle 이벤트 없이도 레벨을 즉시 반영한다.
     */
    const runCollisionDetectionRef = useRef<(() => void) | null>(null);
    const idleCollisionRafRef = useRef<number | null>(null);
    /**
     * panTo 직후 idle 이벤트에서 충돌 감지를 건너뛰기 위한 플래그.
     * panTo는 줌 레벨을 유지하므로 마커 간 상대 픽셀 거리가 변하지 않아
     * 충돌 감지 결과가 동일하다. 불필요한 O(n²) 연산을 억제한다.
     */
    const suppressCollisionRef = useRef(false);

    const [scriptError, setScriptError] = useState<string | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        getMap: () => mapRef.current,
        getViewport: () => {
          if (!mapRef.current) return null;
          return getViewportFromMap(mapRef.current);
        },
        panTo: (lat: number, lng: number, offsetY?: number) => {
          if (mapRef.current) {
            for (const marker of markerInstancesRef.current.values()) {
              if (marker.getMap() === null) {
                marker.setMap(mapRef.current);
              }
            }
            suppressCollisionRef.current = true;

            const target = new naver.maps.LatLng(lat, lng);
            if (offsetY && offsetY !== 0) {
              // projection을 이용해 목표 좌표를 offsetY 픽셀만큼 북쪽(위)으로 이동.
              // fromCoordToOffset: 현재 줌 기준 월드 픽셀 좌표 반환 (Y 아래 방향 양수).
              // target.y + offsetY → 지도 중심을 target보다 남쪽으로 이동 → 화면에서 마커가 위로 올라감.
              const projection = mapRef.current.getProjection();
              const pt = projection.fromCoordToOffset(target);
              const adjusted = projection.fromOffsetToCoord(
                new naver.maps.Point(pt.x, pt.y + offsetY)
              );
              mapRef.current.panTo(adjusted);
            } else {
              mapRef.current.panTo(target);
            }
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
      onMapEmptyClickRef.current = onMapEmptyClick;
    }, [onMapEmptyClick]);

    useEffect(() => {
      onMarkerClickRef.current = onMarkerClick;
    }, [onMarkerClick]);

    // markerViewModels / selectedMarkerId ref 동기화 — idle 핸들러에서 최신값 참조용
    useEffect(() => {
      markerViewModelsRef.current = markerViewModels ?? [];
    }, [markerViewModels]);

    useEffect(() => {
      selectedMarkerIdRef.current = selectedMarkerId ?? null;
    }, [selectedMarkerId]);

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
            gl: true,
            customStyleId: NAVER_MAP_CUSTOM_STYLE_ID,
          });

          mapRef.current = map;
          setIsMapReady(true);

          const loadCb = onLoadRef.current;
          if (loadCb) loadCb(map);

          // 충돌 감지 + 마커 레벨 업데이트 함수.
          // idle 핸들러와 markerViewModels 변경 시 모두 호출된다.
          const runCollisionDetection = () => {
            const models = markerViewModelsRef.current;
            const currentSelectedId = selectedMarkerIdRef.current;
            const projection = map.getProjection();
            const bounds = map.getBounds() as naver.maps.LatLngBounds | null;
            if (!bounds) return;

            // 1. 실제로 지도에 표시 중인 마커만 추출.
            // MarkerClustering이 클러스터로 묶은 마커는 setMap(null) 상태이므로 제외된다.
            // zoom 숫자가 아닌 실제 가시성을 기준으로 하여, 클러스터링 구간(zoom ≤ 15)에서도
            // 클러스터에 포함되지 않은 단독 마커에는 충돌 감지가 적용된다.
            const visibleModels = models.filter((m) => {
              const marker = markerInstancesRef.current.get(m.id);
              return marker != null && marker.getMap() !== null && bounds.hasLatLng(new naver.maps.LatLng(m.lat, m.lng));
            });

            // 2. 라벨 DOM 크기 측정 (캐시 미스만)
            for (const m of visibleModels) {
              if (!labelSizeCacheRef.current.has(m.id)) {
                const markerEl = markerInstancesRef.current.get(m.id)?.getElement();
                const labelEl = markerEl?.querySelector('[data-marker-label]');
                if (labelEl) {
                  const rect = labelEl.getBoundingClientRect();
                  if (rect.width > 0) {
                    labelSizeCacheRef.current.set(m.id, {
                      width: rect.width,
                      height: rect.height,
                    });
                  }
                }
              }
            }

            // 3. MarkerBox 배열 생성
            // labelSize: DOM 측정값 우선, 없으면 CSS 제약 기반 상수로 폴백.
            // idle 시점에 마커 DOM이 아직 렌더링되지 않은 경우를 대비한 안전장치.
            const boxes = visibleModels.map((m) => {
              const pos = projection.fromCoordToOffset(new naver.maps.LatLng(m.lat, m.lng));
              const labelSize = labelSizeCacheRef.current.get(m.id) ?? {
                width: PRICE_MARKER_LABEL_W,
                height: PRICE_MARKER_LABEL_H,
              };
              const isSelected = m.id === currentSelectedId;
              const priority = getMarkerPriority(isSelected, m.favorite === 'on');
              const scale = isSelected ? 1.3 : 1;
              return buildMarkerBox(m.id, { x: pos.x, y: pos.y }, labelSize, priority, scale);
            });

            // 4. 충돌 검사 → 레벨 결정
            const newLevels = computeMarkerLevels(boxes, currentSelectedId ?? undefined);

            // 5. 변경된 마커만 setIcon 업데이트
            for (const m of visibleModels) {
              const newLevel = newLevels.get(m.id) ?? 1;
              const isSelected = m.id === currentSelectedId;

              const prevLevel = markerLevelsRef.current.get(m.id);

              // 선택된 마커의 아이콘·캐시는 selectedMarkerId effect에서 전담 관리.
              // - 캐시를 여기서 쓰면 알고리즘이 반환한 level 1이 덮어써져,
              //   effect가 currLevel=1로 fast path를 타면서 setIcon을 건너뛰게 됨.
              // - 캐시를 skip하면 선택 이전의 진짜 충돌 레벨이 남아있어
              //   effect가 필요 시 setIcon(level 1)을 올바르게 호출한다.
              if (isSelected) continue;

              // 충돌 감지 레벨은 비선택 마커만 캐시에 저장.
              // 선택 해제 시 selectedMarkerId effect가 이 값으로 복원한다.
              markerLevelsRef.current.set(m.id, newLevel);

              if (prevLevel !== newLevel) {
                const marker = markerInstancesRef.current.get(m.id);
                if (marker) {
                  marker.setZIndex(m.favorite === 'on' ? 1 : 0);
                  const anchorX = newLevel === 3 ? PRICE_MARKER_DOT_ANCHOR_X : PRICE_MARKER_ANCHOR_X;
                  const anchorY = newLevel === 3 ? PRICE_MARKER_DOT_ANCHOR_Y : PRICE_MARKER_ANCHOR_Y;
                  marker.setIcon({
                    content: renderPriceMarker({
                      level: newLevel,
                      name: m.name,
                      price: m.priceText,
                      isFave: m.favorite === 'on',
                      isPartial: m.isPartial,
                      isActive: false,
                      extraRoomCount: m.extraRoomCount,
                    }),
                    anchor: new naver.maps.Point(anchorX, anchorY),
                  });
                }
              }
            }
          };

          runCollisionDetectionRef.current = runCollisionDetection;

          idleListenerRef.current = naver.maps.Event.addListener(map, 'idle', () => {
            // 뷰포트 변경 알림
            const viewportCb = onViewportChangeRef.current;
            if (viewportCb) viewportCb(getViewportFromMap(map));

            // panTo 직후 idle은 충돌 감지를 건너뜀.
            // panTo는 줌 레벨을 유지하므로 마커 간 상대 픽셀 거리가 변하지 않아
            // 결과가 동일하다. 플래그를 소비한 뒤 즉시 리셋.
            if (suppressCollisionRef.current) {
              suppressCollisionRef.current = false;
              return;
            }

            // 충돌 감지를 다음 프레임으로 지연.
            // idle 이벤트는 우리 리스너와 MarkerClustering 내부 리스너가 모두 구독하는데,
            // 등록 순서상 우리 리스너가 먼저 실행된다.
            // 클러스터 해제 시(zoom 15→16) MarkerClustering이 개별 마커를 setMap(map)으로
            // 복원하기 전에 우리 코드가 실행되면 visibleModels가 비어 충돌 감지가 무시된다.
            // requestAnimationFrame으로 한 프레임 뒤에 실행하면 MarkerClustering 처리가
            // 완료된 이후에 충돌 감지가 실행된다.
            idleCollisionRafRef.current = requestAnimationFrame(runCollisionDetection);
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
        if (mapClickListenerRef.current) {
          naver.maps.Event.removeListener(mapClickListenerRef.current);
          mapClickListenerRef.current = null;
        }

        runCollisionDetectionRef.current = null;

        if (idleCollisionRafRef.current !== null) {
          cancelAnimationFrame(idleCollisionRafRef.current);
          idleCollisionRafRef.current = null;
        }

        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
          setIsMapReady(false);
        }
      };
    }, []);

    // markerViewModels 변경 시 마커 전체 재생성.
    // 마커 클릭 시 onMarkerClick 호출 → 상위에서 캐러셀 표시.
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

      // 마커 재생성 시 레벨/라벨 캐시 초기화
      labelSizeCacheRef.current.clear();
      markerLevelsRef.current.clear();

      for (const model of models) {
        // MarkerClustering이 마커 가시성(setMap)을 관리하므로 map 속성 없이 생성.
        // 클러스터링 미사용 폴백 시에는 아래에서 직접 setMap을 호출한다.
        // 초기 렌더링은 level 1로 시작. idle 이벤트에서 충돌 검사 후 레벨 조정됨.
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(model.lat, model.lng),
          zIndex: model.favorite === 'on' ? 1 : 0,
          icon: {
            content: renderPriceMarker({
              level: 1,
              name: model.name,
              price: model.priceText,
              isFave: model.favorite === 'on',
              isPartial: model.isPartial,
              isActive: false,
              extraRoomCount: model.extraRoomCount,
            }),
            anchor: new naver.maps.Point(PRICE_MARKER_ANCHOR_X, PRICE_MARKER_ANCHOR_Y),
          },
        });

        markerArray.push(marker);
        markerInstancesRef.current.set(model.id, marker);
        markerListenersRef.current.push(
          naver.maps.Event.addListener(marker, 'click', () => {
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
          minClusterSize: 1,
          // zoom < 15(≤ 14)에서 클러스터 활성, zoom ≥ 15에서 개별 마커 표시. MapPage의 캐러셀 닫힘 조건과 연동.
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

      // 마커 재생성 후 idle 이벤트 없이도 충돌 감지를 즉시 실행한다.
      // idle은 지도가 이동·줌이 완료된 뒤에만 발생하므로,
      // 같은 위치에서 재검색하면 idle이 발생하지 않아 마커가 level 1로 굳는 문제를 방지.
      // requestAnimationFrame으로 마커 DOM이 브라우저에 그려진 뒤 실행.
      const rafId = requestAnimationFrame(() => {
        runCollisionDetectionRef.current?.();
      });

      return () => {
        cancelAnimationFrame(rafId);
      };
    }, [isMapReady, markerViewModels]);

    // selectedMarkerId 변경 시 이전·현재 마커의 활성 상태를 전환한다.
    //
    // [공통 경로 — level 1] setIcon 없이 data-pm-active 속성 토글만 수행.
    //   DOM 재생성이 없어 캐러셀 슬라이딩 중 "툭" 끊기는 현상을 방지한다.
    //   이전 마커의 fave 여부는 DOM data-pm-type 속성에서 읽어 models.find를 생략한다.
    //
    // [폴백 — level 2/3] 충돌 감지로 축소된 마커를 선택할 때만 setIcon으로 level 1 전환.
    //   해제 시에도 마커 레벨 캐시 기준 원래 크기로 복원한다.
    useEffect(() => {
      if (!isMapReady) return;

      const currId = selectedMarkerId ?? null;
      const prevId = prevSelectedMarkerIdRef.current;
      prevSelectedMarkerIdRef.current = currId;

      const rafId = requestAnimationFrame(() => {
        // ── 이전 마커 비활성화 ──────────────────────────────────────────────
        if (prevId) {
          const prevMarker = markerInstancesRef.current.get(prevId);
          if (prevMarker) {
            const prevLevel = markerLevelsRef.current.get(prevId) ?? 1;
            const prevEl = prevMarker.getElement()?.querySelector<HTMLElement>('[data-pm-active]');
            // data-pm-type에서 fave 여부 판별 → models.find 불필요
            const isFave = prevEl?.dataset.pmType?.startsWith('fave') ?? false;
            prevMarker.setZIndex(isFave ? 1 : 0);

            if (prevLevel === 1) {
              // [공통] CSS 토글만 — DOM 재생성 없음
              prevEl?.setAttribute('data-pm-active', 'false');
            } else {
              // [폴백] level 2/3 복원 — setIcon 필요
              const prevModel = (markerViewModels ?? []).find((m) => m.id === prevId);
              if (prevModel) {
                const anchorX = prevLevel === 3 ? PRICE_MARKER_DOT_ANCHOR_X : PRICE_MARKER_ANCHOR_X;
                const anchorY = prevLevel === 3 ? PRICE_MARKER_DOT_ANCHOR_Y : PRICE_MARKER_ANCHOR_Y;
                prevMarker.setIcon({
                  content: renderPriceMarker({
                    level: prevLevel,
                    name: prevModel.name,
                    price: prevModel.priceText,
                    isFave: prevModel.favorite === 'on',
                    isPartial: prevModel.isPartial,
                    isActive: false,
                    extraRoomCount: prevModel.extraRoomCount,
                  }),
                  anchor: new naver.maps.Point(anchorX, anchorY),
                });
              }
            }
          }
        }

        // ── 현재 마커 활성화 ────────────────────────────────────────────────
        if (currId) {
          const currMarker = markerInstancesRef.current.get(currId);
          if (currMarker) {
            const currLevel = markerLevelsRef.current.get(currId) ?? 1;
            currMarker.setZIndex(1000);

            if (currLevel === 1) {
              // [공통] CSS 토글만 — DOM 재생성 없음
              currMarker
                .getElement()
                ?.querySelector<HTMLElement>('[data-pm-active]')
                ?.setAttribute('data-pm-active', 'true');
            } else {
              // [폴백] level 2/3 → level 1 전환 후 CSS 활성화
              const currModel = (markerViewModels ?? []).find((m) => m.id === currId);
              if (currModel) {
                currMarker.setIcon({
                  content: renderPriceMarker({
                    level: 1,
                    name: currModel.name,
                    price: currModel.priceText,
                    isFave: currModel.favorite === 'on',
                    isPartial: currModel.isPartial,
                    isActive: false,
                    extraRoomCount: currModel.extraRoomCount,
                  }),
                  anchor: new naver.maps.Point(PRICE_MARKER_ANCHOR_X, PRICE_MARKER_ANCHOR_Y),
                });
                // setIcon이 DOM을 교체한 직후 새 요소에 활성 속성 적용
                currMarker
                  .getElement()
                  ?.querySelector<HTMLElement>('[data-pm-active]')
                  ?.setAttribute('data-pm-active', 'true');
              }
            }
          }
        }

        // 선택 마커 변경 시 주변 마커 충돌 레벨 재계산.
        // idle 없이 선택만 바꾸면 idle이 발화하지 않아 강등이 누락되므로 여기서도 호출.
        runCollisionDetectionRef.current?.();
      });

      return () => cancelAnimationFrame(rafId);
    }, [isMapReady, selectedMarkerId, markerViewModels]);

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
      <div className={className} style={{ width: '100%', height: '100%' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
);

NaverMap.displayName = 'NaverMap';

export default NaverMap;
