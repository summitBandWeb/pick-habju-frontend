import { useMemo } from 'react';
import { ROOMS } from '../constants/data';
import { sortCards } from '../utils/sortCards';
import { partialSearch } from '../utils/partialSearch';
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

    // 검색어 필터링 (부분검색 지원, 정렬은 기존 sortCards 로직 사용)
    if (searchText.trim()) {
      filteredCards = filteredCards.filter((card) => {
        const room = ROOMS[card.roomIndex];
        return partialSearch(searchText, room.name, room.branch);
      });
    }

    // 정렬 적용
    return sortCards(filteredCards, sortType, sortParams);
  }, [cards, includePartiallyPossible, searchText, sortType, sortParams]);
};
