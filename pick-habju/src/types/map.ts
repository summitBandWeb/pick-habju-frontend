// 1. 위도(lat), 경도(lng)를 가진 단순한 좌표 객체
export type MapCenter = { lat: number; lng: number };

// 2. 지도의 사각형 영역 (남서쪽 좌표 ~ 북동쪽 좌표)
export type MapBounds = { 
  swLat: number; 
  swLng: number; 
  neLat: number; 
  neLng: number 
};

// 3. 현재 지도의 중심과 영역을 한 번에 나타내는 뷰포트 정보
export type MapViewport = { 
  center: MapCenter; 
  bounds: MapBounds 
};

// 4. 부모 컴포넌트(MapPage)가 NaverMap 컴포넌트를 직접 조종하기 위한 인터페이스
export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
};

export interface NaverMapHandle {
  getMap: () => naver.maps.Map | null; // 원본 지도 객체에 접근
  getViewport: () => MapViewport | null; // 현재 지도의 좌표 정보들을 가져옴
  panTo: (lat: number, lng: number) => void; // 부드러운 이동 함수
  setCenter: (lat: number, lng: number) => void; // 즉시 이동 함수
}
