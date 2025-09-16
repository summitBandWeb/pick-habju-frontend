declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>;
  }
}

export const pushGtmEvent = (eventName: string, params?: Record<string, any>) => {
  try {
    if (typeof window === 'undefined') return;
    const dl = (window.dataLayer = window.dataLayer || []);
    dl.push({ event: eventName, ...(params || {}) });
  } catch {
    // no-op
  }
};
