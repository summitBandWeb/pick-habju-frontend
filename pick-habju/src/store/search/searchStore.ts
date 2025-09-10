import { create } from 'zustand';
import { SearchPhase, CardKind, type SearchState, type AvailabilityResponse, type SearchCardItem, type SlotAvailability } from './searchStore.types';
import { ROOMS, UNKNOWN_DATES_BY_BUSINESS_ID, REOPEN_AFTER_DAYS_BY_BUSINESS_ID, type UnknownDateRule } from '../../constants/data';

// 오픈대기 안내에 사용할 임계일(현재 날짜 기준 X일 이후)
const reopenDaysByBusinessId = REOPEN_AFTER_DAYS_BY_BUSINESS_ID;

const hasConsecutiveTrues = (slots: Record<string, SlotAvailability>): boolean => {
  const entries = Object.entries(slots).sort(([a], [b]) => (a < b ? -1 : 1));
  let streak = 0;
  for (const [, val] of entries) {
    if (val === true) {
      streak += 1;
      if (streak >= 1) return true;
    } else {
      if (streak >= 2) return true;
      streak = 0;
    }
  }
  return streak >= 1;
};

export const useSearchStore = create<SearchState>((set) => ({
  phase: SearchPhase.BeforeSearch,
  cards: [],
  filteredCards: [],
  includePartiallyPossible: false,
  setPhase: (phase: SearchPhase) => set({ phase }),
  setLastQuery: (q) => set({ lastQuery: q }),
  setFilteredCards: (cards) => set({ filteredCards: cards }),
  setIncludePartiallyPossible: (include) => set({ includePartiallyPossible: include }),
  setDefaultFromResponse: ({ response }: { response: AvailabilityResponse; peopleCount: number }) => {
    const availableIds = new Set<string>(Array.isArray(response.available_biz_item_ids) ? response.available_biz_item_ids : []);
    const results = Array.isArray(response.results) ? response.results : [];

    const nextCards: SearchCardItem[] = [];

    // 헬퍼: 상수로 정의된 날짜 규칙과 특정 날짜가 매칭되는지 검사
    const isDateInRule = (date: string, rule?: UnknownDateRule): boolean => {
      if (!rule) return false;
      if (Array.isArray(rule.dates) && rule.dates.includes(date)) return true;
      if (Array.isArray(rule.ranges)) {
        for (const range of rule.ranges) {
          if (range.start <= date && date <= range.end) return true;
        }
      }
      return false;
    };

    // 1) 오픈 대기 집합: API 응답 + 상수 규칙 + 임계일(동적) 병합
    const unknownBusinessIds = new Set<string>();

    // 1-1) API 응답 기반
    results.forEach((r) => {
      if (r.available === 'unknown') {
        unknownBusinessIds.add(r.business_id);
      }
    });

    // 1-2) 상수 기반: 사업장 단위
    Object.entries(UNKNOWN_DATES_BY_BUSINESS_ID).forEach(([bizId, rule]) => {
      if (isDateInRule(response.date, rule)) {
        unknownBusinessIds.add(bizId);
      }
    });

    // 1-3) 임계일(현재 날짜 기준 X일 이후) 규칙 적용
    const toDateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const parseYmd = (ymd: string) => {
      const [y, m, da] = ymd.split('-').map((n) => parseInt(n, 10));
      return new Date(y, m - 1, da);
    };
    const today = toDateOnly(new Date());
    const target = toDateOnly(parseYmd(response.date));
    const diffDays = Math.floor((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    Object.entries(reopenDaysByBusinessId).forEach(([bizId, threshold]) => {
      if (diffDays >= threshold) {
        unknownBusinessIds.add(bizId);
      }
    });

    // 방 단위 설정은 사용하지 않음 (요구사항에 따라 사업장 단위만 적용)

    // 2) Default: available_biz_item_ids 기준, 단 unknown 합주실은 제외
    ROOMS.forEach((room, idx) => {
      if (availableIds.has(room.bizItemId) && !unknownBusinessIds.has(room.businessId)) {
        nextCards.push({ kind: CardKind.ENTIRE, roomIndex: idx });
      }
    });

    // 3) Open wait: 합주실(business_id) 단위로 1개만 표시
    unknownBusinessIds.forEach((bizId) => {
      const idx = ROOMS.findIndex((rm) => rm.businessId === bizId);
      if (idx !== -1) {
        const days = reopenDaysByBusinessId[bizId] ?? 90;
        nextCards.push({ kind: CardKind.NOT_YET, roomIndex: idx, reOpenDaysFromNow: days });
      }
    });

    // 4) Recommend time: 요청한 시간대가 2시간 이상일 때만 표시
    if (Array.isArray(response.hour_slots) && response.hour_slots.length >= 2) {
      results.forEach((r) => {
        if (r.available === false && r.available_slots && typeof r.available_slots === 'object') {
          if (hasConsecutiveTrues(r.available_slots)) {
            const idx = ROOMS.findIndex((rm) => rm.bizItemId === r.biz_item_id);
            if (idx !== -1 && !unknownBusinessIds.has(ROOMS[idx].businessId)) {
              nextCards.push({ kind: CardKind.PARTIAL, roomIndex: idx, availableSlots: r.available_slots });
            }
          }
        }
      });
    }

    if (nextCards.length === 0) {
      set({ phase: SearchPhase.NoResult, cards: [], filteredCards: [] });
    } else {
      set({ phase: SearchPhase.Default, cards: nextCards, filteredCards: nextCards });
    }
  },
}));
