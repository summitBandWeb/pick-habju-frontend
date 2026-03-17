import { useState, useEffect, useMemo } from 'react';
import { expandBounds } from '../utils/mapQuery';
import { useNavigate } from 'react-router-dom';

// Components
import { SEO } from '../components/SEO/SEO';
import HeroArea from '../components/HeroArea/HeroArea';
import PastTimeUpdateModal from '../components/Modal/Time/PastTimeUpdateModal';

// Stores & Types
import { useGoogleFormToastStore } from '../store/googleFormToast/googleFormToastStore';
import { useSearchStore } from '../store/search/searchStore';
import useReservationStore from '../store/dateTime/reservationStore';

// Constants
import { SEO_METADATA, DEFAULT_SEO } from '../constants/seo';
import RoutePaths from '../router/routePaths';

// Hooks
import { useDefaultDateTime } from '../hook/useDefaultDateTime';

// Utils
import { usePingQuery } from '../api/coldStart/usePingQueries';
import type { SearchParams } from '../store/search/searchStore.types';
import { formatReservationLabel } from '../utils/formatReservationLabel';

const HomePage = () => {
  // Cold Start 방지 (서버 Warm-up)
  usePingQuery();

  // 1. UI 상태 관리
  const [heroResetCounter, setHeroResetCounter] = useState(0);
  /**
   * 시간 만료로 인한 강제 리셋 여부.
   * PastTimeUpdateModal에서 "네, 검색할게요" 를 누르면 true가 되어
   * lastQuery가 있어도 현재 시각 기준 기본값으로 HeroArea를 다시 초기화한다.
   * 이후 사용자가 검색하면 false로 초기화된다.
   */
  const [isExpiredReset, setIsExpiredReset] = useState(false);

  // 2. Global Stores
  const { showToast } = useGoogleFormToastStore();
  const setLastQuery = useSearchStore((s) => s.setLastQuery);
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const reservationActions = useReservationStore((s) => s.actions);

  // 3. 초기 데이터 — 이전 검색 조건 복원 여부에 따라 HeroArea 초기값 결정
  const { defaultDateIso, defaultSlots, defaultDateTimeLabel, defaultPeopleCount } = useDefaultDateTime();

  /** 이전 검색 조건이 있고, 시간 만료 리셋이 아닐 때만 이전 조건으로 복원 */
  const shouldRestoreLastSearch = !!lastQuery && !isExpiredReset;

  const heroDateTime = useMemo(
    () =>
      shouldRestoreLastSearch
        ? {
            label: formatReservationLabel(lastQuery.date, lastQuery.hour_slots),
            date: lastQuery.date,
            hour_slots: lastQuery.hour_slots,
          }
        : { label: defaultDateTimeLabel, date: defaultDateIso, hour_slots: defaultSlots },
    [defaultDateIso, defaultDateTimeLabel, defaultSlots, lastQuery, shouldRestoreLastSearch]
  );

  const heroPeopleCount = shouldRestoreLastSearch ? lastQuery.peopleCount : defaultPeopleCount;

  // 4. 라우터
  const navigate = useNavigate();

  // 5. Event Handler: 검색 시작 (HeroArea에서 이미 full SearchParams 전달)
  const onSearch = (params: SearchParams) => {
    setIsExpiredReset(false);
    setLastQuery({ ...params, bounds: expandBounds(params.bounds) });
    navigate(RoutePaths.MAP);
  };

  // 6. Effects: 첫 진입 시 구글 폼 토스트 노출
  useEffect(() => {
    showToast();
  }, [showToast]);

  return (
    <>
      <SEO {...SEO_METADATA.home} url={DEFAULT_SEO.siteUrl} />
      <div className="w-full flex flex-col items-center">
        <div className="flex w-full max-w-[25.125rem] flex-col justify-center items-center bg-yellow-300">
          {/* Hero Area: 날짜, 시간, 인원 선택 */}
          <HeroArea
            key={heroResetCounter}
            dateTime={heroDateTime}
            peopleCount={heroPeopleCount}
            initialLocationId={shouldRestoreLastSearch ? lastQuery.stationId : undefined}
            onSearch={onSearch}
          />

          {/* Modal: 과거 시간 선택 시 갱신 유도 */}
          <PastTimeUpdateModal
            onConfirm={() => {
              reservationActions.reset();
              setIsExpiredReset(true);
              setHeroResetCounter((c) => c + 1);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
