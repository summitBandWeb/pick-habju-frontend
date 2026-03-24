import { create } from 'zustand';
import { type SearchState } from './searchStore.types';

export const useSearchStore = create<SearchState>((set) => ({
  includePartiallyPossible: false,
  setIncludePartiallyPossible: (include) => set({ includePartiallyPossible: include }),
  setLastQuery: (q) => set({ lastQuery: q }),
}));
