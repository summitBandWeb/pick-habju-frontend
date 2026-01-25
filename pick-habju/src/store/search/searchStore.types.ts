export interface SearchParams {
  date: string;
  hour_slots: string[];
  peopleCount: number;
}

export enum SearchPhase {
  BeforeSearch = 'BeforeSearch',
  Loading = 'Loading',
  NoResult = 'NoResult',
  Default = 'Default',
}

export type SearchState = {
  phase: SearchPhase;
  setPhase: (phase: SearchPhase) => void;
  // Default 화면 렌더링용 카드 데이터
  cards: SearchCardItem[];
  // 필터링/정렬된 카드 데이터 (실제 렌더링용)
  filteredCards: SearchCardItem[];
  // 일부가능 포함 여부
  includePartiallyPossible: boolean;
  setIncludePartiallyPossible: (include: boolean) => void;
  // 마지막 검색 조건 (가격 계산 등에 사용)
  lastQuery?: {
    date: string;
    hour_slots: string[];
    peopleCount: number;
  };
  // 응답 → Default 카드 구성 액션
  setDefaultFromResponse: (args: { response: AvailabilityResponse; peopleCount: number }) => void;
  setLastQuery: (q: { date: string; hour_slots: string[]; peopleCount: number }) => void;
  // 필터링된 카드 설정 액션
  setFilteredCards: (cards: SearchCardItem[]) => void;
};

export enum CardKind {
  ENTIRE = 'entire', // 전체 시간 이용 가능 (기존 'default')
  NOT_YET = 'not_yet', // 아직 오픈 안함 (기존 'open')
  PARTIAL = 'partial', // 일부 시간만 가능 (기존 'recommend')
}

export type SearchCardItem = {
  kind: CardKind;
  roomIndex: number; // ROOMS 인덱스
  reOpenDaysFromNow?: number;
  availableSlots?: Record<string, SlotAvailability>; // recommend용
};

// API 응답 타입 (프론트 내부 공유용)
export type SlotAvailability = boolean | 'unknown';
export interface AvailabilityResultItem {
  name: string;
  branch: string;
  business_id: string;
  biz_item_id: string;
  available: SlotAvailability;
  available_slots: Record<string, SlotAvailability>;
}
export interface AvailabilityResponse {
  date: string;
  hour_slots: string[];
  results: AvailabilityResultItem[];
  available_biz_item_ids: string[];
}
