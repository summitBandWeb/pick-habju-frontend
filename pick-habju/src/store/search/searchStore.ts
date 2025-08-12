import { create } from 'zustand';
import { SearchPhase, type SearchState, type AvailabilityResponse, type SearchCardItem, type SlotAvailability } from './searchStore.types';
import { ROOMS } from '../../constants/data';

const reopenDaysByBusinessId: Record<string, number> = {
  sadang: 90,
  dream_sadang: 100,
};

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
  setPhase: (phase: SearchPhase) => set({ phase }),
  setLastQuery: (q) => set({ lastQuery: q }),
  setDefaultFromResponse: ({ response }: { response: AvailabilityResponse; peopleCount: number }) => {
    const availableIds = new Set<string>(Array.isArray(response.available_biz_item_ids) ? response.available_biz_item_ids : []);
    const results = Array.isArray(response.results) ? response.results : [];

    const nextCards: SearchCardItem[] = [];

    // 1) 오픈 대기: available === 'unknown' → 합주실 단위 집합 구하기
    const unknownBusinessIds = new Set<string>();
    results.forEach((r) => {
      if (r.available === 'unknown') {
        unknownBusinessIds.add(r.business_id);
      }
    });

    // 2) Default: available_biz_item_ids 기준, 단 unknown 합주실은 제외
    ROOMS.forEach((room, idx) => {
      if (availableIds.has(room.bizItemId) && !unknownBusinessIds.has(room.businessId)) {
        nextCards.push({ kind: 'default', roomIndex: idx });
      }
    });

    // 3) Open wait: 합주실(business_id) 단위로 1개만 표시
    unknownBusinessIds.forEach((bizId) => {
      const idx = ROOMS.findIndex((rm) => rm.businessId === bizId);
      if (idx !== -1) {
        const days = reopenDaysByBusinessId[bizId] ?? 90;
        nextCards.push({ kind: 'open', roomIndex: idx, reOpenDaysFromNow: days });
      }
    });

    // 4) Recommend time: 요청한 시간대가 2시간 이상일 때만 표시
    if (Array.isArray(response.hour_slots) && response.hour_slots.length >= 2) {
      results.forEach((r) => {
        if (r.available === false && r.available_slots && typeof r.available_slots === 'object') {
          if (hasConsecutiveTrues(r.available_slots)) {
            const idx = ROOMS.findIndex((rm) => rm.bizItemId === r.biz_item_id);
            if (idx !== -1 && !unknownBusinessIds.has(ROOMS[idx].businessId)) {
              nextCards.push({ kind: 'recommend', roomIndex: idx, availableSlots: r.available_slots });
            }
          }
        }
      });
    }

    if (nextCards.length === 0) {
      set({ phase: SearchPhase.NoResult, cards: [] });
    } else {
      set({ phase: SearchPhase.Default, cards: nextCards });
    }
  },
}));
