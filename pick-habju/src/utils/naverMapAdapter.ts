import type { MapCenter, MapBounds, MapViewport } from '../types/map';

/**
 * 네이버 LatLng 객체를 프로젝트 공통 MapCenter 타입으로 변환
 * 네이버에서는 위도가 y, 경도가 x입니다.
 */
export const toMapCenter = (c: naver.maps.LatLng): MapCenter => ({ 
  lat: c.y, 
  lng: c.x 
});

/**
 * 네이버 LatLngBounds 객체를 프로젝트 공통 MapBounds 타입으로 변환
 */
export const toMapBounds = (b: naver.maps.LatLngBounds): MapBounds => {
  const sw = b.getSW();
  const ne = b.getNE();
  
  return { 
    swLat: sw.y, 
    swLng: sw.x, 
    neLat: ne.y, 
    neLng: ne.x 
  };
};

/**
 * 현재 지도 객체에서 중심점과 영역 정보를 추출하여 MapViewport 타입으로 반환
 * (Map의 getCenter/getBounds는 지도 좌표계에서 LatLng/LatLngBounds를 반환함)
 */
export const getViewportFromMap = (map: naver.maps.Map): MapViewport => ({
  center: toMapCenter(map.getCenter() as naver.maps.LatLng),
  bounds: toMapBounds(map.getBounds() as naver.maps.LatLngBounds),
  zoom: map.getZoom(),
});
