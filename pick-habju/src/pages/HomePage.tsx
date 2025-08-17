import HeroArea from '../components/HeroArea/HeroArea';
import { ROOMS } from '../constants/data';
import { postRoomAvailabilitySmart, type AvailabilityRequest, type AvailabilityResponse } from '../api/availabilityApi';
import { useSearchStore } from '../store/search/searchStore';
import { SearchPhase } from '../store/search/searchStore.types';
import SearchSection from '../components/Search/SearchSection';
import { trackApiResponseTime, trackSearchResults, trackError } from '../utils/analytics';
import { showToastByKey } from '../utils/showToastByKey';
import { useToastStore } from '../store/toast/toastStore';
import { ReservationToastKey } from '../components/ToastMessage/ToastMessageEnums';
import { useReservationActions } from '../hook/useReservationStore';
import { useState } from 'react';
import PastTimeUpdateModal from '../components/Modal/Time/PastTimeUpdateModal';


const HomePage = () => {
  const { showPersistentToast, hideToast } = useToastStore();
  const reservationActions = useReservationActions();
  const [heroResetCounter, setHeroResetCounter] = useState(0);
  // 현재 시간에서 다음 정시로 올림 (예: 14:00 -> 15:00, 14:03 -> 15:00)
  const now = new Date();
  const baseDate = new Date(now);
  let startHour = now.getHours() + 1;
  if (startHour === 24) {
    // 자정 넘어가는 경우: 날짜 +1, 00시 시작
    baseDate.setDate(baseDate.getDate() + 1);
    startHour = 0;
  }

  const month = baseDate.getMonth() + 1;
  const day = String(baseDate.getDate()).padStart(2, '0');
  const weekdayKorean = ['일', '월', '화', '수', '목', '금', '토'][baseDate.getDay()];

  const rawEndHour = (startHour + 2) % 24;
  const displayEndHour = rawEndHour === 0 ? 24 : rawEndHour <= startHour ? rawEndHour + 24 : rawEndHour;
  const defaultDateIso = `${baseDate.getFullYear()}-${String(month).padStart(2, '0')}-${day}`;
  const defaultSlots = [
    `${String(startHour).padStart(2, '0')}:00`,
    `${String((startHour + 1) % 24).padStart(2, '0')}:00`,
  ];
  const defaultDateTimeLabel = `${month}월 ${day}일 (${weekdayKorean}) ${startHour}~${displayEndHour}시`;
  const defaultPeopleCount = 12;

  const setDefaultFromResponse = useSearchStore((s) => s.setDefaultFromResponse);
  const setPhase = useSearchStore((s) => s.setPhase);
  const setLastQuery = useSearchStore((s) => s.setLastQuery);

  const handleSearch = async (params: { date: string; hour_slots: string[]; peopleCount: number }) => {
    const { date, hour_slots, peopleCount } = params;
    const searchStartTime = Date.now(); // 전체 검색 시작 시간

    setLastQuery({ date, hour_slots, peopleCount });
    setPhase(SearchPhase.Loading);

    // 인원수 기준으로 룸 필터링
    const filteredRooms = ROOMS.filter((r) => peopleCount <= r.maxCapacity).map((r) => ({
      name: r.name,
      branch: r.branch,
      business_id: r.businessId,
      biz_item_id: r.bizItemId,
    }));

    // 혹시몰라 두긴했는데.. 빈 배열이 나오면 안되니까 체크
    if (filteredRooms.length === 0) {
      setPhase(SearchPhase.NoResult);
      // 검색 결과 없음을 GA에 추적
      const searchDuration = Date.now() - searchStartTime;
      trackSearchResults(0, 0, searchDuration);
      return;
    }

    const payload: AvailabilityRequest = {
      date,
      hour_slots,
      rooms: filteredRooms,
    };

    try {
      const apiStartTime = Date.now(); // API 호출 시작 시간
      const respPromise = postRoomAvailabilitySmart(payload);

      // 4초 넘으면 경고 토스트 노출 (스켈레톤은 SearchSection에서 렌더됨)
      const toastTimer = setTimeout(() => {
        showPersistentToast('서버가 혼잡합니다. 잠시만 기다려 주세요.', 'warning');
      }, 4000);

      const resp: AvailabilityResponse = await respPromise;
      clearTimeout(toastTimer);
      hideToast();
      const apiElapsed = Date.now() - apiStartTime; // 실제 API 응답 시간

      // API 응답 시간을 GA에 추적
      const totalRooms = resp.results?.length || 0;
      trackApiResponseTime(apiElapsed, true, totalRooms);

      const remain = Math.max(0, 1000 - apiElapsed); // 최소 1초 보장
      if (remain > 0) {
        await new Promise((r) => setTimeout(r, remain));
      }

      // 검색 결과를 GA에 추적
      const searchDuration = Date.now() - searchStartTime;
      const availableRooms = resp.results?.filter((room) =>
        room.available === true || room.available === 'unknown'
      ).length || 0;

      trackSearchResults(totalRooms, availableRooms, searchDuration);

      // 검색 도중 시간이 지나 선택 시작 시간이 현재를 과거가 되었는지 재확인
      const firstSlot = Array.isArray(hour_slots) && hour_slots.length > 0 ? hour_slots[0] : null;
      if (firstSlot) {
        const startDateTime = new Date(`${date}T${firstSlot}`);
        const nowCheck = new Date();
        if (nowCheck.getTime() > startDateTime.getTime()) {
          showToastByKey(ReservationToastKey.PAST_TIME);
          reservationActions.reset();
          setPhase(SearchPhase.BeforeSearch);
          setHeroResetCounter((c) => c + 1);
          return;
        }
      }

      setDefaultFromResponse({ response: resp, peopleCount });
      hideToast();
    } catch (e) {
      hideToast();
      const apiElapsed = Date.now() - searchStartTime;

      // 에러 발생을 GA에 추적
      trackApiResponseTime(apiElapsed, false);
      const errMsg = e instanceof Error ? e.message : String(e);
      trackError('api_call_failed', errMsg);

      // 백엔드 과거시간 오류(Hour-002) 처리: 토스트 + 상태 초기화 + HeroArea 기본값 재설정
      try {
        const jsonStart = errMsg.indexOf('{');
        if (jsonStart >= 0) {
          const jsonText = errMsg.slice(jsonStart);
          const parsed = JSON.parse(jsonText);
          if (parsed?.errorCode === 'Hour-002' || /과거 시간은 허용되지 않습니다/.test(parsed?.message)) {
            showToastByKey(ReservationToastKey.PAST_TIME);
            reservationActions.reset();
            setPhase(SearchPhase.BeforeSearch);
            setHeroResetCounter((c: number) => c + 1);
            return;
          }
        }
      } catch {
        // 파싱 실패 시 일반 에러 처리로 폴백
      }

      console.error(e);
      alert('가용 시간 조회 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
      setPhase(SearchPhase.BeforeSearch);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-[25.125rem] flex-col justify-center items-center bg-primary-white">
        <HeroArea
          key={heroResetCounter}
          dateTime={{ label: defaultDateTimeLabel, date: defaultDateIso, hour_slots: defaultSlots }}
          peopleCount={defaultPeopleCount}
          onDateTimeChange={() => {
            // 날짜/시간 변경 확정 시 결과를 숨김
            setPhase(SearchPhase.BeforeSearch);
          }}
          onPersonCountChange={() => {
            // 인원 변경 확정 시 결과를 숨김
            setPhase(SearchPhase.BeforeSearch);
          }}
          onSearch={handleSearch}
        />
        <PastTimeUpdateModal onHeroReset={() => setHeroResetCounter((c) => c + 1)} />
        {/* 결과 뷰는 SearchSection이 phase에 따라 렌더 */}
        <div className="w-full">
          <SearchSection />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
