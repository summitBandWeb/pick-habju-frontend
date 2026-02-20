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
  onDateTimeChange?: () => void;
  onPersonCountChange?: () => void;
  onSearch: (params: {
    location: string;
    locationId: string;
    coordinates: { lat: number; lng: number };
    bounds: { swLat: number; swLng: number; neLat: number; neLng: number };
    date: string;
    hour_slots: string[];
    peopleCount: number;
  }) => void;
}
