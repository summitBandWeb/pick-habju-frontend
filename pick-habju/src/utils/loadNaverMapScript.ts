const NAVER_MAP_SCRIPT_ID = 'naver-maps-script';
const SCRIPT_BASE =
  'https://openapi.map.naver.com/openapi/v3/maps.js';

const MARKER_CLUSTERING_SCRIPT_ID = 'naver-maps-clustering-script';
const MARKER_CLUSTERING_SRC =
  'https://cdn.jsdelivr.net/gh/navermaps/marker-tools.js@master/marker-clustering/src/MarkerClustering.js';

let loadPromise: Promise<typeof naver> | null = null;

/**
 * MarkerClustering.js를 동적으로 로드.
 * naver maps 스크립트 로드 완료 이후 호출해야 합니다.
 * 실패 시 reject하지 않고 경고만 출력하여 지도 기능은 유지합니다.
 */
function loadMarkerClusteringScript(): Promise<void> {
  if (window.MarkerClustering) return Promise.resolve();

  const existing = document.getElementById(MARKER_CLUSTERING_SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (window.MarkerClustering) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load MarkerClustering script')),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = MARKER_CLUSTERING_SCRIPT_ID;
    script.type = 'text/javascript';
    script.src = MARKER_CLUSTERING_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load MarkerClustering script'));
    document.head.appendChild(script);
  });
}

/**
 * Vite 환경 변수 VITE_NAVER_MAP_CLIENT_ID 로 네이버 지도 스크립트를 동적으로 로드합니다.
 * index.html 에서는 HTML 치환이 되지 않으므로, 여기서 올바른 Client ID 를 넣어 요청해야 인증이 성공합니다.
 * 지도 스크립트 로드 후 MarkerClustering 스크립트도 연속으로 로드합니다.
 * MarkerClustering 로드 실패 시 경고를 출력하지만 지도 기능은 유지됩니다.
 */
export function loadNaverMapScript(): Promise<typeof naver> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Naver Map is not available in SSR'));
  }
  if (window.naver?.maps && window.MarkerClustering) {
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
    const afterNaverLoaded = () => {
      loadMarkerClusteringScript()
        .then(() => resolve(window.naver))
        .catch((err) => {
          console.warn('[NaverMap] MarkerClustering 스크립트 로드 실패. 클러스터링 없이 동작합니다.', err);
          resolve(window.naver);
        });
    };

    const existing = document.getElementById(NAVER_MAP_SCRIPT_ID);
    if (existing) {
      if (window.naver?.maps) {
        afterNaverLoaded();
      } else {
        existing.addEventListener('load', afterNaverLoaded, { once: true });
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
    script.onload = afterNaverLoaded;
    script.onerror = () =>
      reject(new Error('Failed to load Naver Map script'));
    document.head.appendChild(script);
  });

  return loadPromise;
}
