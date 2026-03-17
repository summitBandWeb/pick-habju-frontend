import type { ServiceableStationId } from '../../constants/serviceable_stations';
import type { SearchParams } from '../../store/search/searchStore.types';

/** 현재 열려 있는 드롭다운 종류. 아무것도 열리지 않은 경우 null */
export type ActiveDropdown = 'dateTime' | 'person' | 'location' | null;

export interface HeroAreaProps {
  /** 날짜·시간 초기값 */
  dateTime: {
    label: string; // UI 표기를 위한 라벨
    date: string; // YYYY-MM-DD
    hour_slots: string[]; // ["19:00","20:00"]
  };
  peopleCount: number;
  /** 초기 선택 지역 ID (미지정 시 기본 역 사용) */
  initialLocationId?: ServiceableStationId;
  onDateTimeChange?: () => void;
  onPersonCountChange?: () => void;
  onSearch: (params: SearchParams) => void;
}
