import { useSearchStore } from '../store/search/searchStore';
import { useReservationActions } from '../hook/useReservationStore';
import { ROOMS } from '../constants/data';
import { SearchPhase, type SearchParams } from '../store/search/searchStore.types';
import { trackSearchResults } from '../utils/analytics';
import { showToastByKey } from '../utils/showToastByKey';
import { ReservationToastKey } from '../components/ToastMessage/ToastMessageEnums';
import { useRoomAvailabilityApi } from './useRoomAvailabilityApi';

interface UseHomePageSearchProps {
  onReset: () => void; // 에러 발생 시 UI 리셋을 위한 콜백
}

export const useHomePageSearch = ({ onReset }: UseHomePageSearchProps) => {
  // 1. 네트워크 로직 (API 호출 담당)
  const { fetchAvailability, isLoading } = useRoomAvailabilityApi();

  // 2. 스토어 액션들
  const setPhase = useSearchStore((s) => s.setPhase);
  const setLastQuery = useSearchStore((s) => s.setLastQuery);
  const setDefaultFromResponse = useSearchStore((s) => s.setDefaultFromResponse);
  const reservationActions = useReservationActions();

  // 3. 핵심 검색 함수
  const handleSearch = async (params: SearchParams) => {
    const { date, hour_slots, peopleCount } = params;
    const searchStartTime = Date.now();

    // 상태 초기화
    setLastQuery({ date, hour_slots, peopleCount });
    setPhase(SearchPhase.Loading);

    // [Business Logic] 인원수 필터링
    const filteredRooms = ROOMS.filter((r) => peopleCount <= r.maxCapacity).map((r) => ({
      name: r.name,
      branch: r.branch,
      business_id: r.businessId,
      biz_item_id: r.bizItemId,
    }));

    // 빈 배열이 나오면 안되니까 체크
    if (filteredRooms.length === 0) {
      setPhase(SearchPhase.NoResult);
      // 검색 결과 없음을 GA에 추적
      trackSearchResults(0, 0, Date.now() - searchStartTime);
      return;
    }

    // [Network] API 호출 (결과, 시간, 에러만 받아옴)
    const { response, error } = await fetchAvailability({
      date,
      hour_slots,
      rooms: filteredRooms,
    });

    // [Error Handler]
    if (error || !response) {
      const errMsg = error instanceof Error ? error.message : String(error);

      // 과거 시간 에러 체크
      if (isPastTimeError(errMsg)) {
        triggerResetAction();
        return;
      }

      console.error(error);
      alert('가용 시간 조회 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
      setPhase(SearchPhase.BeforeSearch);
      return;
    }

    // [Success Handler]
    const totalRooms = response.results?.length || 0;

    const availableRooms =
      response.results?.filter((r) => r.available === true || r.available === 'unknown').length || 0;
    trackSearchResults(totalRooms, availableRooms, Date.now() - searchStartTime);

    // 클라이언트단 과거 시간 검증
    if (isPastTime(date, hour_slots)) {
      triggerResetAction();
      return;
    }

    // 최종 데이터 스토어 반영
    setDefaultFromResponse({ response, peopleCount });
  };

  // --- 내부 헬퍼 함수 ---

  const triggerResetAction = () => {
    showToastByKey(ReservationToastKey.PAST_TIME);
    reservationActions.reset();
    setPhase(SearchPhase.BeforeSearch);
    onReset(); // 부모(HomePage)가 전달한 리셋 함수 실행
  };

  const isPastTime = (date: string, slots: string[]) => {
    const firstSlot = slots?.[0];
    if (!firstSlot) return false;
    return new Date().getTime() > new Date(`${date}T${firstSlot}`).getTime();
  };

  const isPastTimeError = (errMsg: string) => {
    try {
      const jsonStart = errMsg.indexOf('{');
      if (jsonStart >= 0) {
        const parsed = JSON.parse(errMsg.slice(jsonStart));
        return parsed?.errorCode === 'Hour-002' || /과거 시간은 허용되지 않습니다/.test(parsed?.message);
      }
    } catch {
      return false;
    }
    return false;
  };

  return { handleSearch, isLoading };
};
