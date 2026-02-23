const NAVER_MAP_SCRIPT_ID = 'naver-maps-script';
const SCRIPT_BASE =
  'https://openapi.map.naver.com/openapi/v3/maps.js';

let loadPromise: Promise<typeof naver> | null = null;

/**
 * Vite 환경 변수 VITE_NAVER_MAP_CLIENT_ID 로 네이버 지도 스크립트를 동적으로 로드합니다.
 * index.html 에서는 HTML 치환이 되지 않으므로, 여기서 올바른 Client ID 를 넣어 요청해야 인증이 성공합니다.
 */
export function loadNaverMapScript(): Promise<typeof naver> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Naver Map is not available in SSR'));
  }
  if (window.naver?.maps) {
    return Promise.resolve(window.naver);
  }
  if (loadPromise) {
    return loadPromise;
  }

  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
  if (!clientId || typeof clientId !== 'string') {
    return Promise.reject(
      new Error(
        'VITE_NAVER_MAP_CLIENT_ID is not set. Add it to .env (e.g. VITE_NAVER_MAP_CLIENT_ID=your_client_id).'
      )
    );
  }
  
  const url = `${SCRIPT_BASE}?ncpKeyId=${encodeURIComponent(clientId)}&submodules=geocoder`;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(NAVER_MAP_SCRIPT_ID);
    if (existing) {
      if (window.naver?.maps) resolve(window.naver);
      else {
        existing.addEventListener(
          'load',
          () => resolve(window.naver),
          { once: true }
        );
        existing.addEventListener(
          'error',
          () => reject(new Error('Failed to load Naver Map script')),
          { once: true }
        );
      }
      return;
    }
    const script = document.createElement('script');
    script.id = NAVER_MAP_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = url;
    script.async = true;
    script.onload = () => resolve(window.naver);
    script.onerror = () =>
      reject(new Error('Failed to load Naver Map script'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
