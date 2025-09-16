import { create } from 'zustand';
import { pushGtmEvent } from '../../utils/gtm';
import { getApiCallCountInSession } from '../../api/apiClient';

type SessionAnalyticsState = {
  sessionStartedAt: number;
  bookModalOpenCount: number;
  bookModalStep1EnteredAt?: number;
  bookModalStep2EnteredAt?: number;
  bookModalLastDurationMs?: number;
  step2ConfirmClickCount: number;
  incrementBookModalOpen: () => void;
  markEnterStep1: () => void;
  markEnterStep2: () => void;
  markStep2Confirm: () => void;
  flushOnUnload: () => void;
};

export const useSessionAnalyticsStore = create<SessionAnalyticsState>((set, get) => ({
  sessionStartedAt: Date.now(),
  bookModalOpenCount: 0,
  bookModalStep1EnteredAt: undefined,
  bookModalStep2EnteredAt: undefined,
  bookModalLastDurationMs: undefined,
  step2ConfirmClickCount: 0,

  incrementBookModalOpen: () => set((prev) => ({ bookModalOpenCount: prev.bookModalOpenCount + 1 })),
  markEnterStep1: () => set({ bookModalStep1EnteredAt: Date.now() }),
  markEnterStep2: () => set({ bookModalStep2EnteredAt: Date.now() }),
  markStep2Confirm: () => set((prev) => ({ step2ConfirmClickCount: prev.step2ConfirmClickCount + 1 })),

  flushOnUnload: () => {
    const s = get();
    const apiCalls = getApiCallCountInSession();
    let durationMs: number | undefined = undefined;
    if (s.bookModalStep1EnteredAt && s.bookModalStep2EnteredAt) {
      durationMs = s.bookModalStep2EnteredAt - s.bookModalStep1EnteredAt;
    }
    pushGtmEvent('session_summary', {
      session_duration_ms: Date.now() - s.sessionStartedAt,
      api_call_count: apiCalls,
      book_modal_open_count: s.bookModalOpenCount,
      book_modal_step1_to_step2_duration_ms: durationMs,
      step2_confirm_click_count: s.step2ConfirmClickCount,
    });
  },
}));
