import { useMemo } from 'react';
import { ROOMS } from '../constants/data';
import { sortCards } from '../utils/sortCards';
import { SortType } from '../components/FilterSection/FilterSection.constants';
import type { SearchCardItem } from '../store/search/searchStore.types';
import { CardKind } from '../store/search/searchStore.types';

interface UseFilteredCardsParams {
  cards: SearchCardItem[];
  includePartiallyPossible: boolean;
  searchText: string;
  sortType: SortType;
  sortParams: {
    hourSlots: string[];
    peopleCount: number;
    dateIso: string;
  };
}

export const useFilteredCards = ({
  cards,
  includePartiallyPossible,
  searchText,
  sortType,
  sortParams,
}: UseFilteredCardsParams): SearchCardItem[] => {
  return useMemo(() => {
    let filteredCards = cards;

    // includePartiallyPossible 상태에 따른 partial 카드 필터링
    if (!includePartiallyPossible) {
      filteredCards = cards.filter((card) => card.kind !== CardKind.PARTIAL);
    }

    // 검색어 필터링
    if (searchText.trim()) {
      filteredCards = filteredCards.filter((card) => {
        const room = ROOMS[card.roomIndex];
        const searchTerm = searchText.toLowerCase();
        return room.name.toLowerCase().includes(searchTerm) || room.branch.toLowerCase().includes(searchTerm);
      });
    }

    // 정렬 적용
    return sortCards(filteredCards, sortType, sortParams);
  }, [cards, includePartiallyPossible, searchText, sortType, sortParams]);
};
