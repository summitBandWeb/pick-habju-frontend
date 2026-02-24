import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NaverMap from '../components/Map/NaverMap';
import { useMapPageSearch } from '../hook/useMapPageSearch';
import RoutePaths from '../router/routePaths';
import { useSearchStore } from '../store/search/searchStore';
import type { NaverMapHandle } from '../types/map';

const DEFAULT_MAP_ZOOM = 14;

const MapPage = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const navigate = useNavigate();
  const mapRef = useRef<NaverMapHandle | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    isLoading,
    errorMessage,
    markers,
    roomCoordById,
  } = useMapPageSearch();

  const handleSelectRoom = useCallback(
    (id: string) => {
      if (id === selectedRoomId) return;
      setSelectedRoomId(id);
      const coord = roomCoordById[id];
      if (!coord) return;
      mapRef.current?.panTo(coord.lat, coord.lng);
    },
    [roomCoordById, selectedRoomId]
  );

  useEffect(() => {
    if (!lastQuery) {
      navigate(RoutePaths.HOME, { replace: true });
    }
  }, [lastQuery, navigate]);

  if (!lastQuery) {
    return null;
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="text-sm text-gray-600" role="status" aria-live="polite">
          {isLoading ? 'Loading map search...' : errorMessage ? `Error: ${errorMessage}` : 'Map search ready'}
        </div>
        {showSearchHereButton && (
          <button
            type="button"
            onClick={handleSearchHere}
            className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
          >
            Search this area
          </button>
        )}
      </div>

      <div className="flex-1">
        <NaverMap
          ref={mapRef}
          initialCenter={lastQuery.center}
          initialZoom={DEFAULT_MAP_ZOOM}
          markers={markers}
          selectedMarkerId={selectedRoomId}
          onMarkerClick={handleSelectRoom}
          onViewportChange={handleViewportChange}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default MapPage;
