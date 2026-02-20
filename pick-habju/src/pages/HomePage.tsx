import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { SEO } from '../components/SEO/SEO';
import HeroArea from '../components/HeroArea/HeroArea';
import PastTimeUpdateModal from '../components/Modal/Time/PastTimeUpdateModal';

// Stores & Types
import { useGoogleFormToastStore } from '../store/googleFormToast/googleFormToastStore';
import { useSearchStore } from '../store/search/searchStore';

// Constants
import { SEO_METADATA, DEFAULT_SEO } from '../constants/seo';
import RoutePaths from '../router/routePaths';

// Hooks
import { useDefaultDateTime } from '../hook/useDefaultDateTime';

// Utils
import { usePingQuery } from '../api/coldStart/usePingQueries';

const HomePage = () => {
  // Cold Start 방지 (서버 Warm-up)
  usePingQuery();

  // 1. UI 상태 관리 (HeroArea 강제 리렌더링용)
  const [heroResetCounter, setHeroResetCounter] = useState(0);

  // 2. Global Stores
  const { showToast } = useGoogleFormToastStore();
  const setLastQuery = useSearchStore((s) => s.setLastQuery);

  // 3. 초기 데이터 (Default Values)
  const { defaultDateIso, defaultSlots, defaultDateTimeLabel, defaultPeopleCount } = useDefaultDateTime();

  // 4. 라우터
  const navigate = useNavigate();

  // 5. Event Handler: 검색 시작
  const onSearch = (params: {
    location: string;
    locationId: string;
    coordinates: { lat: number; lng: number };
    bounds: { swLat: number; swLng: number; neLat: number; neLng: number };
    date: string;
    hour_slots: string[];
    peopleCount: number;
  }) => {
    setLastQuery(params);
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
            onSearch={onSearch}
          />

          {/* Modal: 과거 시간 선택 시 갱신 유도 */}
          <PastTimeUpdateModal onHeroReset={() => setHeroResetCounter((c) => c + 1)} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
