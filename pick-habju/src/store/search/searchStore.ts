import { create } from 'zustand';
import type { SearchState } from './searchStore.types';
import { SearchPhase } from './searchStore.types';

export const useSearchStore = create<SearchState>((set) => ({
  phase: SearchPhase.BeforeSearch,
  setPhase: (phase: SearchPhase) => set({ phase }),
}));
