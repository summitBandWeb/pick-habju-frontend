import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface GoogleFormToastState {
  isVisible: boolean;
  hasVisitedGoogleForm: boolean;
  showToast: () => void;
  hideToast: () => void;
  markGoogleFormVisited: () => void;
  resetState: () => void;
}

export const GOOGLE_FORM_URL = 'https://forms.gle/uea6mtKQSBoAN7fs6';

// 초기 상태를 별도 객체로 분리
const initialState = {
  isVisible: false,
  hasVisitedGoogleForm: false,
};

export const useGoogleFormToastStore = create<GoogleFormToastState>()(
  immer(
    persist(
      (set, get) => ({
        ...initialState,

        showToast: () => {
          if (!get().hasVisitedGoogleForm) {
            set((state) => {
              state.isVisible = true;
            });
          }
        },

        hideToast: () => {
          set((state) => {
            state.isVisible = false;
          });
        },

        markGoogleFormVisited: () => {
          set((state) => {
            state.hasVisitedGoogleForm = true;
            state.isVisible = false;
          });
        },

        resetState: () => {
          set(() => ({ ...initialState }));
        },
      }),
      {
        name: 'google-form-toast-storage',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          hasVisitedGoogleForm: state.hasVisitedGoogleForm,
        }),
      }
    )
  )
);
