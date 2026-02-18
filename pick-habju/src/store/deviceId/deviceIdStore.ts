import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { DeviceIdState } from './deviceIdStore.types';

const initialState = {
  deviceId: null as string | null,
};

/**
 * 디바이스 고유 ID를 전역 상태로 관리하는 Store
 * - 최초 방문 시 UUID 생성 후 localStorage에 자동 저장 (persist 미들웨어)
 * - 재방문 시 저장된 deviceId 자동 복원
 */

export const useDeviceIdStore = create<DeviceIdState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeDeviceId: () => {
        const state = get();

        // 이미 deviceId가 있으면 초기화하지 않음
        if (state.deviceId) {
          return;
        }

        // deviceId 생성
        const newDeviceId = crypto.randomUUID();
        set({ deviceId: newDeviceId });
      },
    }),
    {
      name: 'device-id-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
