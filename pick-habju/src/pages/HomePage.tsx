import { useState, useEffect } from 'react';

// Components
import { SEO } from '../components/SEO/SEO';
import HeroArea from '../components/HeroArea/HeroArea';
import SearchBar from '../components/SearchBar/SearchBar';
import SearchBarSkeleton from '../components/SearchBar/SearchBarSkeleton';
import FilterSection from '../components/FilterSection/FilterSection';
import FilterSectionSkeleton from '../components/FilterSection/FilterSectionSkeleton';
import SearchSection from '../components/Search/SearchSection';
import PastTimeUpdateModal from '../components/Modal/Time/PastTimeUpdateModal';

// Stores & Types
import { useSearchStore } from '../store/search/searchStore';
import { useGoogleFormToastStore } from '../store/googleFormToast/googleFormToastStore';
import { SearchPhase } from '../store/search/searchStore.types';

// Constants
import { SEO_METADATA, DEFAULT_SEO } from '../constants/seo';

// Hooks
import { useDefaultDateTime } from '../hook/useDefaultDateTime';
import { useHomePageFilter } from '../hook/useHomePageFilter';
import { useHomePageSearch } from '../hook/useHomePageSearch';

const HomePage = () => {
  // 1. UI 상태 관리 (HeroArea 강제 리렌더링용)
  const [heroResetCounter, setHeroResetCounter] = useState(0);

  // 2. Global Stores (UI 렌더링 제어용)
  const phase = useSearchStore((s) => s.phase);
  const setPhase = useSearchStore((s) => s.setPhase);
  const { showToast } = useGoogleFormToastStore();

  // 3. 초기 데이터 (Default Values)
  const { defaultDateIso, defaultSlots, defaultDateTimeLabel, defaultPeopleCount } = useDefaultDateTime();

  // 4. Custom Hooks: 필터 로직 (검색어, 정렬, 필터링 결과 처리)
  const { searchText, setSearchText, sortType, setSortType, resetFilters } = useHomePageFilter();

  // 5. Custom Hooks: 검색 비즈니스 로직 (API 호출, 에러 핸들링)
  const { handleSearch: executeSearch } = useHomePageSearch({
    onReset: () => setHeroResetCounter((c) => c + 1), // 에러/과거시간 발생 시 UI 카운터 증가
  });

  // 6. Event Handler: 검색 시작 (필터 초기화 후 API 호출)
  const onSearch = (params: { date: string; hour_slots: string[]; peopleCount: number }) => {
    resetFilters(); // 새로운 검색 시 기존 필터(검색어, 정렬) 초기화
    executeSearch(params);
  };

  // 7. Effects: 첫 진입 시 구글 폼 토스트 노출
  useEffect(() => {
    showToast();
  }, [showToast]);

  return (
    <>
      <SEO {...SEO_METADATA.home} url={DEFAULT_SEO.siteUrl} />
      <div className="w-full flex flex-col items-center">
        <div className="flex w-full max-w-[25.9375rem] flex-col justify-center items-center bg-yellow-300">
        {/* Hero Area: 날짜, 시간, 인원 선택 */}
        <HeroArea
          key={heroResetCounter}
          dateTime={{
            label: defaultDateTimeLabel,
            date: defaultDateIso,
            hour_slots: defaultSlots,
          }}
          peopleCount={defaultPeopleCount}
          onDateTimeChange={() => setPhase(SearchPhase.BeforeSearch)}
          onPersonCountChange={() => setPhase(SearchPhase.BeforeSearch)}
          onSearch={onSearch}
        />

        {/* Loading State: 스켈레톤 UI */}
        {phase === SearchPhase.Loading && (
          <>
            <div className="mt-3 mb-2">
              <SearchBarSkeleton />
            </div>
            <FilterSectionSkeleton />
          </>
        )}

        {/* Default State (Search Completed): 필터 및 검색바 */}
        {phase === SearchPhase.Default && (
          <>
            <div className="mt-3 mb-2">
              <SearchBar value={searchText} onSearchChange={setSearchText} />
            </div>
            <div className="mx-auto">
              <FilterSection sortValue={sortType} onSortChange={setSortType} />
            </div>
          </>
        )}

        {/* Modal: 과거 시간 선택 시 갱신 유도 */}
        <PastTimeUpdateModal onHeroReset={() => setHeroResetCounter((c) => c + 1)} />

        {/* Search Results: 결과 리스트 (내부에서 phase에 따라 렌더링) */}
        <div className="w-full">
          <SearchSection />
        </div>
      </div>
    </div>
    </>
  );
};

export default HomePage;
