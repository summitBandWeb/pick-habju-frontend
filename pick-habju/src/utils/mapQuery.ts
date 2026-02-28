/**
 * 지도 검색 관련 "순수 유틸 함수" 모음.
 *
 * - mergeViewportToLastQuery: 기존 검색 조건 유지 + center/bounds만 교체
 * - isOutsideBaseBounds: 현재 bounds가 기준 bounds를 벗어났는지 판정
 * - buildRoomAvailabilityPayload: lastQuery를 API 요청 DTO(RoomRequestDto)로 변환 (hour_slots → start_hour/end_hour 포함)
 */
import type { RoomRequestDto } from '../api/get/roomApi';
import type { SearchParams } from '../store/search/searchStore.types';
import type { MapBounds, MapViewport } from '../types/map';

const BOUNDS_EPSILON = 0.000001;

/**
 * 뷰포트 span의 30%를 버퍼로 계산 (하한 0.002° ≈ 200m, 상한 0.025° ≈ 2.5km).
 * 버퍼를 적용한 MapBounds 반환. API 호출 영역 및 lastQuery.bounds 저장에 사용.
 */
export const expandBounds = (bounds: MapBounds): MapBounds => {
  const latBuffer = Math.min(Math.max((bounds.neLat - bounds.swLat) * 0.3, 0.002), 0.025);
  const lngBuffer = Math.min(Math.max((bounds.neLng - bounds.swLng) * 0.3, 0.002), 0.025);
  return {
    swLat: bounds.swLat - latBuffer,
    swLng: bounds.swLng - lngBuffer,
    neLat: bounds.neLat + latBuffer,
    neLng: bounds.neLng + lngBuffer,
  };
};

const addOneHour = (time: string): string => {
  const parts = time.split(':');
  if (parts.length !== 2) {
    throw new Error(`Invalid time string: ${JSON.stringify(time)}`);
  }
  const [hourRaw, minuteRaw] = parts;
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    throw new Error(`Invalid time string: ${JSON.stringify(time)}`);
  }
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error(`Invalid time string: ${JSON.stringify(time)}`);
  }

  const nextHour = (hour + 1) % 24;
  return `${String(nextHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

/** 기존 검색 조건(date, peopleCount, hour_slots 등) 유지하고 center는 viewport, bounds는 버퍼 적용한 값으로 교체 */
export const mergeViewportToLastQuery = (
  lastQuery: SearchParams,
  viewport: MapViewport
): SearchParams => ({
  ...lastQuery,
  center: viewport.center,
  bounds: expandBounds(viewport.bounds),
});

/** 현재 bounds가 기준(base) bounds를 벗어났는지 판정 (약간의 오차 허용) */
export const isOutsideBaseBounds = (current: MapBounds, base: MapBounds): boolean => {
  return (
    current.swLat < base.swLat - BOUNDS_EPSILON ||
    current.swLng < base.swLng - BOUNDS_EPSILON ||
    current.neLat > base.neLat + BOUNDS_EPSILON ||
    current.neLng > base.neLng + BOUNDS_EPSILON
  );
};

/** lastQuery를 API 요청 DTO(RoomRequestDto)로 변환. hour_slots → start_hour/end_hour 포함 */
export const buildRoomAvailabilityPayload = (lastQuery: SearchParams | undefined): RoomRequestDto | null => {
  if (!lastQuery) return null;
  if (!Array.isArray(lastQuery.hour_slots) || lastQuery.hour_slots.length === 0) return null;

  const startHour = lastQuery.hour_slots[0];
  const lastHour = lastQuery.hour_slots[lastQuery.hour_slots.length - 1];

  return {
    date: lastQuery.date,
    capacity: lastQuery.peopleCount,
    start_hour: startHour,
    end_hour: addOneHour(lastHour),
    swLat: lastQuery.bounds.swLat,
    swLng: lastQuery.bounds.swLng,
    neLat: lastQuery.bounds.neLat,
    neLng: lastQuery.bounds.neLng,
  };
};
