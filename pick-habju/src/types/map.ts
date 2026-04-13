/** 지도 중심 좌표 (위도, 경도). */
export type MapCenter = { lat: number; lng: number };

/** 지도 영역의 사각형 범위. sw = 남서, ne = 북동. */
export type MapBounds = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
};

/** 지도 뷰포트: 현재 중심과 보이는 영역(bounds). 검색/뷰포트 변경 시 사용. */
export type MapViewport = {
  center: MapCenter;
  bounds: MapBounds;
  zoom: number;
};

/** 지도 마커 기본 정보. id는 room 또는 business 식별자. */
export type MapMarker = {
  id: string;
  lat: number;
  lng: number;
};

/** 마커(지점) 내 개별 룸 항목. 캐러셀·팝오버 리스트용. */
export type MarkerRoomItem = {
  id: string;
  name: string;
  priceText: string;
  isPartial: boolean;
  favorite: 'on' | 'off';
};

/** 마커 UI 상태. 부분 가능·즐겨찾기·선택(활성) 여부. */
export type MarkerUiState = {
  isPartial: boolean;
  favorite: 'on' | 'off';
  isActive: boolean;
};

/** 지도 마커 하나에 대한 뷰모델. 좌표 + 가격 텍스트 + UI 상태 + 해당 지점의 룸 목록(rooms). */
export type MarkerViewModel = MapMarker &
  MarkerUiState & {
    name: string;
    priceText: string;
    extraRoomCount: number;
    rooms: MarkerRoomItem[];
  };

/** NaverMap ref로 노출하는 핸들. 지도 인스턴스 조회, 뷰포트 조회, panTo/setCenter. */
export interface NaverMapHandle {
  getMap: () => naver.maps.Map | null;
  getViewport: () => MapViewport | null;
  /**
   * 지도를 (lat, lng)으로 이동.
   * offsetY: 화면 픽셀 기준 수직 오프셋. 양수이면 마커가 화면 중앙보다 위에 위치.
   * 상단 UI(검색바)와 하단 UI(캐러셀)를 제외한 가시 영역 중앙에 마커를 맞출 때 사용.
   */
  panTo: (lat: number, lng: number, offsetY?: number) => void;
  setCenter: (lat: number, lng: number) => void;
}

