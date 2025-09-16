import { create } from 'zustand';
import { pushGtmEvent } from '../../utils/gtm';

type AnalyticsCycleState = {
  cycleId: number;
  startedAt: number;
  partiallyPossibleClickCount: number;
  sortDropdownToggleClickCount: number;
  sortDropdownOpenCount: number;
  sortDropdownItemClickCount: number;
  optionSelectCounts: Record<string, number>;
  lastSelectedSortOption?: string;
  startNewCycle: () => void;
  endCycleAndFlush: (meta?: Record<string, any>) => void;
  recordPartiallyPossibleClick: () => void;
  recordSortDropdownToggle: () => void;
  recordSortDropdownOpen: () => void;
  recordSortOptionSelect: (value: string) => void;
};

export const useAnalyticsCycleStore = create<AnalyticsCycleState>((set, get) => ({
  cycleId: 1,
  startedAt: Date.now(),
  partiallyPossibleClickCount: 0,
  sortDropdownToggleClickCount: 0,
  sortDropdownOpenCount: 0,
  sortDropdownItemClickCount: 0,
  optionSelectCounts: {},
  lastSelectedSortOption: undefined,

  startNewCycle: () =>
    set({
      cycleId: get().cycleId + 1,
      startedAt: Date.now(),
      partiallyPossibleClickCount: 0,
      sortDropdownToggleClickCount: 0,
      sortDropdownOpenCount: 0,
      sortDropdownItemClickCount: 0,
      optionSelectCounts: {},
      lastSelectedSortOption: undefined,
    }),

  endCycleAndFlush: (meta) => {
    const s = get();
    const durationMs = Date.now() - s.startedAt;
    pushGtmEvent('fs_cycle_summary', {
      cycle_id: s.cycleId,
      duration_ms: durationMs,
      partially_possible_clicks: s.partiallyPossibleClickCount,
      sort_dropdown_toggle_clicks: s.sortDropdownToggleClickCount,
      sort_dropdown_open_count: s.sortDropdownOpenCount,
      sort_option_click_count: s.sortDropdownItemClickCount,
      option_select_counts: JSON.stringify(s.optionSelectCounts),
      last_selected_sort_option: s.lastSelectedSortOption,
      ...(meta || {}),
    });
    get().startNewCycle();
  },

  recordPartiallyPossibleClick: () =>
    set((prev) => ({ partiallyPossibleClickCount: prev.partiallyPossibleClickCount + 1 })),

  recordSortDropdownToggle: () =>
    set((prev) => ({ sortDropdownToggleClickCount: prev.sortDropdownToggleClickCount + 1 })),

  recordSortDropdownOpen: () =>
    set((prev) => ({ sortDropdownOpenCount: prev.sortDropdownOpenCount + 1 })),

  recordSortOptionSelect: (value: string) =>
    set((prev) => ({
      sortDropdownItemClickCount: prev.sortDropdownItemClickCount + 1,
      optionSelectCounts: { ...prev.optionSelectCounts, [value]: (prev.optionSelectCounts[value] ?? 0) + 1 },
      lastSelectedSortOption: value,
    })),
}));
