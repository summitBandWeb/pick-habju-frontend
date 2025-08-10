import { create } from 'zustand';
import type { ToastState } from './toastStore.types';

export const useToastStore = create<ToastState>((set) => {
  let currentTimeoutId: NodeJS.Timeout | null = null;

  return {
    message: null,
    isVisible: false,
    showToast: (message) => {
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
        currentTimeoutId = null;
      }

      set({ message, isVisible: true });

      currentTimeoutId = setTimeout(() => {
        set({ isVisible: false });
        currentTimeoutId = null;
      }, 900);
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
