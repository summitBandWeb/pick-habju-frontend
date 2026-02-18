import { useEffect } from 'react';
import { useDeviceIdStore } from '../store/deviceId/deviceIdStore';

/**
 * 디바이스 고유 ID를 가져오는 훅
 * - 최초 실행 시 자동으로 deviceId 초기화
 * - persist 미들웨어로 localStorage에 자동 저장/복원
 */
export const useDeviceId = (): string | null => {
  const { deviceId, initializeDeviceId } = useDeviceIdStore();

  useEffect(() => {
    // persist가 복원한 deviceId가 없으면 초기화
    initializeDeviceId();
  }, [initializeDeviceId]);

  return deviceId;
};
