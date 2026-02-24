import { forwardRef, useEffect, useRef, useImperativeHandle, useState } from 'react';
import type { MapMarker, MapViewport, NaverMapHandle } from '../../types/map';
import { getViewportFromMap } from '../../utils/naverMapAdapter';
import { loadNaverMapScript } from '../../utils/loadNaverMapScript';

type NaverMapProps = {
  initialCenter: { lat: number; lng: number };
  initialZoom: number;
  markers?: MapMarker[];
  selectedMarkerId?: string | null;
  onMarkerClick?: (id: string) => void;
  onLoad?: (map: naver.maps.Map) => void;
  onViewportChange?: (viewport: MapViewport) => void;
  className?: string;
};

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(
  ({ initialCenter, initialZoom, markers, selectedMarkerId, onMarkerClick, onLoad, onViewportChange, className }, ref) => {
    // 1. 지도가 그려질 DOM 요소를 잡기 위한 ref
    const mapContainerRef = useRef<HTMLDivElement>(null);
    // 2. 네이버 지도 객체를 보관하기 위한 ref
    const mapRef = useRef<naver.maps.Map | null>(null);
    const idleListenerRef = useRef<naver.maps.MapEventListener | null>(null);
    // 콜백이 바뀌어도 지도 초기화 effect는 1회만 실행하므로, 최신 콜백을 ref로 참조
    const onLoadRef = useRef(onLoad);
    const onViewportChangeRef = useRef(onViewportChange);
    const [scriptError, setScriptError] = useState<string | null>(null);
    void markers;
    void selectedMarkerId;
    void onMarkerClick;

    // 3. 부모 컴포넌트에게 노출할 "손잡이(Handle)" 정의. 명령 권한을 부여합니다.
    useImperativeHandle(ref, () => ({
      getMap: () => mapRef.current,
      getViewport: () => {
        if (!mapRef.current) return null;
        return getViewportFromMap(mapRef.current);
      },
      // 부모가 직접 호출할 수 있는 부드러운 이동 함수
      panTo: (lat: number, lng: number) => {
        if (mapRef.current) {
          mapRef.current.panTo(new naver.maps.LatLng(lat, lng));
        }
      },
      // 즉시 이동 함수
      setCenter: (lat: number, lng: number) => {
        if (mapRef.current) {
          mapRef.current.setCenter(new naver.maps.LatLng(lat, lng));
        }
      }
    }), []);

    useEffect(() => {
      onLoadRef.current = onLoad;
    }, [onLoad]);
    useEffect(() => {
      onViewportChangeRef.current = onViewportChange;
    }, [onViewportChange]);

    useEffect(() => {
      if (!mapContainerRef.current) return;

      let cancelled = false;

      loadNaverMapScript()
        .then(() => {
          if (cancelled || !mapContainerRef.current) return;
          setScriptError(null);

          // 4. 지도 인스턴스 초기 생성 (오직 1회 실행)
          const mapOptions: naver.maps.MapOptions = {
            center: new naver.maps.LatLng(initialCenter.lat, initialCenter.lng),
            zoom: initialZoom,
            // 네이버 지도 기본 UI 숨김 옵션
            zoomControl: false, // 줌 버튼 숨기기
            mapDataControl: false, //오른쪽 아래 네이버 로고 옆 '지도 데이터' 문구 숨기기
          };

          const map = new naver.maps.Map(mapContainerRef.current, mapOptions);
          mapRef.current = map;

          // 5. 생성 직후 onLoad 콜백 실행 (ref로 최신 콜백 호출)
          const loadCb = onLoadRef.current;
          if (loadCb) loadCb(map);

          // 6. 지도 움직임이 멈췄을 때(idle) 이벤트 리스너 등록
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
        if (idleListenerRef.current) {
          naver.maps.Event.removeListener(idleListenerRef.current);
          idleListenerRef.current = null;
        }
        if (mapRef.current) {
          mapRef.current.destroy();
          mapRef.current = null;
        }
      };
      // 초기 1회 실행을 위해 의존성 배열을 비웁니다.
      // 만약 center/zoom 변경 시 지도를 이동시키려면 별도의 useEffect를 사용합니다.
    }, []);

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

    return (
      <div
        ref={mapContainerRef}
        className={className}
        style={{ width: '100%', height: '100%' }} // 기본 크기 지정
      />
    );
  }
);

NaverMap.displayName = 'NaverMap';

export default NaverMap;
