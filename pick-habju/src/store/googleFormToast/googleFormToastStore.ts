import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface GoogleFormToastState {
  isVisible: boolean;
  hasVisitedGoogleForm: boolean;
  searchCount: number;
  hasShownInitialToast: boolean;
  showToast: () => void;
  hideToast: () => void;
  markGoogleFormVisited: () => void;
  incrementSearchCount: () => void;
  resetState: () => void;
}

export const GOOGLE_FORM_URL = 'https://forms.gle/uea6mtKQSBoAN7fs6';

// 초기 상태를 별도 객체로 분리하여 재사용
const initialState = {
  isVisible: false,
  hasVisitedGoogleForm: false,
  searchCount: 0,
  hasShownInitialToast: false,
};

export const useGoogleFormToastStore = create<GoogleFormToastState>()(
  immer(
    persist(
      (set, get) => ({
        ...initialState,

        showToast: () => {
          const state = get();
          // 초기 토스트를 아직 보여주지 않았을 때
          if (!state.hasShownInitialToast) {
            set((draft) => {
              draft.isVisible = true;
              draft.hasShownInitialToast = true;
            });
            return;
          }

          // 구글폼을 아직 방문하지 않았고, 검색 횟수가 정확히 2번일 때만 표시 (총 2번째이자 마지막)
          if (!state.hasVisitedGoogleForm && state.searchCount === 2) {
            set((draft) => {
              draft.isVisible = true;
            });
          }
        },

        hideToast: () => {
          set((draft) => {
            draft.isVisible = false;
          });
        },

        markGoogleFormVisited: () => {
          set((draft) => {
            draft.hasVisitedGoogleForm = true;
            draft.isVisible = false;
          });
        },

        incrementSearchCount: () => {
          set((draft) => {
            draft.searchCount += 1;
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
          searchCount: state.searchCount,
          hasShownInitialToast: state.hasShownInitialToast,
        }),
      }
    )
  )
);
