// Vite의 환경 변수를 읽어와 현재가 운영 환경인지 확인하는 상수를 추가합니다.
// 이 값은 Vercel 대시보드에 설정한 값을 따라 'production' 또는 'preview'가 됩니다.
const isProduction = import.meta.env.VITE_VERCEL_ENV === 'production';

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const pushGtmEvent = (eventName: string, params?: Record<string, unknown>) => {
  // 운영 환경(isProduction=true)이 아니면, 이벤트를 전송하지 않고 함수를 즉시 종료.
  if (!isProduction) {
    return;
  }

  try {
    if (typeof window === 'undefined') return;
    const dl = (window.dataLayer = window.dataLayer || []);
    dl.push({ event: eventName, ...(params || {}) });
  } catch {
    // no-op
  }
};
