import type { ServiceableStationId } from '../../constants/serviceable_stations';
import type { MapCenter, MapBounds } from '../../types/map';

export interface SearchParams {
  location: string; // 지역 이름 (화면 표시용)
  stationId: ServiceableStationId; // 역 ID (내부 식별자)
  center: MapCenter; // 역 중심 좌표
  bounds: MapBounds; // 지역 범위 좌표
  date: string;
  hour_slots: string[];
  peopleCount: number;
}

export type SearchState = {
  // 일부가능 포함 여부
  includePartiallyPossible: boolean;
  setIncludePartiallyPossible: (include: boolean) => void;
  // 마지막 검색 조건 (가격 계산 등에 사용)
  lastQuery?: SearchParams;
  setLastQuery: (q: SearchParams) => void;
};
