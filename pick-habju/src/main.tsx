import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useSessionAnalyticsStore } from './store/analytics/sessionStore';
if (import.meta.env.DEV && import.meta.env.VITE_USE_MSW === 'true') {
  import('./mocks/browser').then(({ startMockWorker }) => startMockWorker());
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
    mutations: {
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
      {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </StrictMode>
  </QueryClientProvider>
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
