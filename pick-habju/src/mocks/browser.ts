import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function startMockWorker(): Promise<void> {
  const isEnabled = import.meta.env.VITE_USE_MSW === 'true';
  if (!isEnabled) return;
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}
