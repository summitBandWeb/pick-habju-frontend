import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import type { MapViewport, NaverMapHandle } from '../../types/map';
import { getViewportFromMap } from '../../utils/naverMapAdapter';

type NaverMapProps = {
  initialCenter: { lat: number; lng: number };
  initialZoom: number;
  onLoad?: (map: naver.maps.Map) => void;
  onViewportChange?: (viewport: MapViewport) => void;
  className?: string;
};

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(
  ({ initialCenter, initialZoom, onLoad, onViewportChange, className }, ref) => {
    // 1. 지도가 그려질 DOM 요소를 잡기 위한 ref
    const mapContainerRef = useRef<HTMLDivElement>(null);
    // 2. 네이버 지도 객체를 보관하기 위한 ref
    const mapRef = useRef<naver.maps.Map | null>(null);

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
      if (!mapContainerRef.current) return;

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

      // 5. 생성 직후 onLoad 콜백 실행
      if (onLoad) onLoad(map);

      // 6. 지도 움직임이 멈췄을 때(idle) 이벤트 리스너 등록
      const idleListener = naver.maps.Event.addListener(map, 'idle', () => {
        if (onViewportChange) {
          onViewportChange(getViewportFromMap(map));
        }
      });

      // 컴포넌트 언마운트 시 이벤트 제거
      return () => {
        naver.maps.Event.removeListener(idleListener);
      };
      // 초기 1회 실행을 위해 의존성 배열을 비웁니다. 
      // 만약 center/zoom 변경 시 지도를 이동시키려면 별도의 useEffect를 사용합니다.
    }, []);

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