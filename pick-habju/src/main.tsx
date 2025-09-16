import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { useSessionAnalyticsStore } from './store/analytics/sessionStore';
if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
  import('./mocks/browser').then(({ startMockWorker }) => startMockWorker());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// 세션 종료 시 요약 이벤트 전송
window.addEventListener('beforeunload', () => {
  try {
    useSessionAnalyticsStore.getState().flushOnUnload();
  } catch (e) {
    console.debug('session flush beforeunload failed', e);
  }
});

document.addEventListener('visibilitychange', () => {
  try {
    if (document.visibilityState === 'hidden') {
      useSessionAnalyticsStore.getState().flushOnUnload();
    }
  } catch (e) {
    console.debug('session flush visibilitychange failed', e);
  }
});
