import { useState, useEffect } from 'react';
import { useSearchStore } from '../store/search/searchStore';
import { useFilteredCards } from '../hook/useFilteredCards';
import { SortType } from '../components/FilterSection/FilterSection.constants';
import { useDefaultDateTime } from '../hook/useDefaultDateTime';

export const useHomePageFilter = () => {
  // 1. 필터 입력 상태 (Local State)
  const [searchText, setSearchText] = useState(''); // 검색어 상태 관리 (SearchBar에서 디바운싱 처리됨)
  const [sortType, setSortType] = useState<SortType>(SortType.PRICE_LOW); // 정렬 상태 관리

  // 2. 필터링에 필요한 데이터 (Store & Default)
  const cards = useSearchStore((s) => s.cards);
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const includePartiallyPossible = useSearchStore((s) => s.includePartiallyPossible);
  const setFilteredCards = useSearchStore((s) => s.setFilteredCards);

  const { defaultDateIso, defaultSlots, defaultPeopleCount } = useDefaultDateTime();

  // 3. 필터링 로직 수행 (Derived State)
  // 검색어와 정렬을 적용한 카드 목록
  const filteredCards = useFilteredCards({
    cards,
    includePartiallyPossible,
    searchText,
    sortType,
    sortParams: {
      hourSlots: lastQuery?.hour_slots || defaultSlots,
      peopleCount: lastQuery?.peopleCount || defaultPeopleCount,
      dateIso: lastQuery?.date || defaultDateIso,
    },
  });

  // 4. 필터링된 카드를 store에 업데이트
  useEffect(() => {
    setFilteredCards(filteredCards);
  }, [filteredCards, setFilteredCards]);

  // 5. 필터 리셋 헬퍼
  const resetFilters = () => {
    setSearchText('');
    setSortType(SortType.PRICE_LOW);
  };

  return {
    searchText,
    setSearchText,
    sortType,
    setSortType,
    resetFilters,
  };
};
