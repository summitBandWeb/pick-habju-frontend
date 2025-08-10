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
  setDefaultFromResponse: ({ response }: { response: AvailabilityResponse; peopleCount: number }) => {
    const availableIds = new Set<string>(Array.isArray(response.available_biz_item_ids) ? response.available_biz_item_ids : []);
    const results = Array.isArray(response.results) ? response.results : [];

    const nextCards: SearchCardItem[] = [];

    // Default: available_biz_item_ids 기준
    ROOMS.forEach((room, idx) => {
      if (availableIds.has(room.bizItemId)) {
        nextCards.push({ kind: 'default', roomIndex: idx });
      }
    });

    // Open wait: available === 'unknown'
    results.forEach((r) => {
      if (r.available === 'unknown') {
        const idx = ROOMS.findIndex((rm) => rm.bizItemId === r.biz_item_id);
        if (idx !== -1) {
          const days = reopenDaysByBusinessId[r.business_id] ?? 90;
          nextCards.push({ kind: 'open', roomIndex: idx, reOpenDaysFromNow: days });
        }
      }
    });

    // Recommend time: available === false and has consecutive true slots
    results.forEach((r) => {
      if (r.available === false && r.available_slots && typeof r.available_slots === 'object') {
        if (hasConsecutiveTrues(r.available_slots)) {
          const idx = ROOMS.findIndex((rm) => rm.bizItemId === r.biz_item_id);
          if (idx !== -1) {
            nextCards.push({ kind: 'recommend', roomIndex: idx });
          }
        }
      }
    });

    if (nextCards.length === 0) {
      set({ phase: SearchPhase.NoResult, cards: [] });
    } else {
      set({ phase: SearchPhase.Default, cards: nextCards });
    }
  },
}));
