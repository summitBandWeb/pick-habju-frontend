import { create } from 'zustand';
import type { ToastState } from './toastStore.types';

export const useToastStore = create<ToastState>((set) => {
  let currentTimeoutId: NodeJS.Timeout | null = null;

  return {
    message: null,
    severity: 'warning',
    isVisible: false,
    showToast: (message, severity = 'warning') => {
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }

      set({ message, severity, isVisible: true });

      currentTimeoutId = setTimeout(() => {
        set({ isVisible: false });
        currentTimeoutId = null;
      }, 1500);
    },
    showPersistentToast: (message, severity = 'warning') => {
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }
      set({ message, severity, isVisible: true });
      // 자동으로 닫지 않음. hideToast가 호출될 때까지 유지
    },
    hideToast: () => {
      // 수동으로 닫을 때도 타이머 클리어
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }
      set({ isVisible: false });
    },
  };
});
