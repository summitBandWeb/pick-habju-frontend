import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NaverMap from '../components/Map/NaverMap';
import RoutePaths from '../router/routePaths';
import { useSearchStore } from '../store/search/searchStore';
import type { NaverMapHandle } from '../types/map';

const DEFAULT_MAP_ZOOM = 14;

const MapPage = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const navigate = useNavigate();
  const mapRef = useRef<NaverMapHandle | null>(null);

  useEffect(() => {
    if (!lastQuery) {
      navigate(RoutePaths.HOME, { replace: true });
      return;
    }
    console.log('[MapPage] search params:', lastQuery);
  }, [lastQuery, navigate]);

  const handleMapLoad = useCallback((map: naver.maps.Map) => {
    console.log('[MapPage] map loaded:', map);
  }, []);

  const handlePrepareSearchHere = useCallback(() => {
    const viewport = mapRef.current?.getViewport();

    if (!viewport) {
      console.warn('[MapPage] viewport is not ready yet.');
      return;
    }

    console.log('[MapPage] prepared viewport for "search here":', viewport);
  }, []);

  if (!lastQuery) {
    return null;
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center justify-end border-b border-gray-200 px-4 py-3">
        <button
          type="button"
          onClick={handlePrepareSearchHere}
          className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
        >
          이 위치에서 검색 (준비)
        </button>
      </div>

      <div className="flex-1">
        <NaverMap
          ref={mapRef}
          initialCenter={lastQuery.center}
          initialZoom={DEFAULT_MAP_ZOOM}
          onLoad={handleMapLoad}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default MapPage;

