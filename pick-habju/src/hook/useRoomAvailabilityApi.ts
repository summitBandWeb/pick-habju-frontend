// src/pages/Home/hooks/useRoomAvailabilityApi.ts
import { useState } from 'react';
import { postRoomAvailabilitySmart, type AvailabilityRequest, type AvailabilityResponse } from '../api/availabilityApi';
import { useToastStore } from '../store/toast/toastStore';
import { trackApiResponseTime, trackError } from '../utils/analytics';

const SLOW_API_THRESHOLD = 4000; // 4초 이상 지연 시 서버 혼잡 토스트 노출
const MIN_LOADING_DURATION_MS = 1000; // 깜빡임 방지를 위한 최소 로딩 시간

interface ApiResult {
  response: AvailabilityResponse | null; // 결과 데이터
  error: unknown | null; // 에러 정보
}

interface UseRoomAvailabilityApiReturn {
  fetchAvailability: (payload: AvailabilityRequest) => Promise<ApiResult>;
  isLoading: boolean;
}

/**
 * 룸 가용성 조회를 담당하는 커스텀 훅
 * - API 호출, 로딩 상태 관리, 에러 핸들링, GA 트래킹을 수행합니다.
 * - UX를 위해 최소 1초의 대기 시간을 보장합니다.
 * - 4초 이상 지연 시 '서버 혼잡' 안내 토스트를 표시합니다.
 */

export const useRoomAvailabilityApi = (): UseRoomAvailabilityApiReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const { showPersistentToast, hideToast } = useToastStore();

  const fetchAvailability = async (payload: AvailabilityRequest): Promise<ApiResult> => {
    setIsLoading(true);
    const apiStartTime = Date.now();
    let toastTimer: NodeJS.Timeout | null = null; // try 블록 밖에서 선언해서 에러 발생 시에도 타이머 해제할 수 있도록 함

    try {
      // 4초 이상 소요 시 '서버 혼잡' 토스트 예약
      toastTimer = setTimeout(() => {
        showPersistentToast('서버가 혼잡합니다. 잠시만 기다려 주세요.', 'warning');
      }, SLOW_API_THRESHOLD);

      const respPromise = postRoomAvailabilitySmart(payload);
      const response: AvailabilityResponse = await respPromise;

      // 응답 성공 시 타이머 해제 및 토스트 닫기
      if (toastTimer) clearTimeout(toastTimer);
      hideToast();

      const apiElapsed = Date.now() - apiStartTime;

      // API 응답 시간을 GA에 추적
      const totalRooms = response.results?.length || 0;
      trackApiResponseTime(apiElapsed, true, totalRooms);

      // 최소 1초 대기 (UX - 깜빡임 방지)
      const remain = Math.max(0, MIN_LOADING_DURATION_MS - apiElapsed);
      if (remain > 0) {
        await new Promise((r) => setTimeout(r, remain));
      }

      return { response, error: null };
    } catch (error) {
      if (toastTimer) clearTimeout(toastTimer);
      hideToast();
      const apiElapsed = Date.now() - apiStartTime;

      // 에러 발생을 GA에 추적
      trackApiResponseTime(apiElapsed, false);
      const errMsg = error instanceof Error ? error.message : String(error);
      trackError('api_call_failed', errMsg);

      return { response: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchAvailability, isLoading };
};
