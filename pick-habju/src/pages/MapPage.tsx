import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NaverMap from '../components/Map/NaverMap';
import { useMapPageSearch } from '../hook/useMapPageSearch';
import RoutePaths from '../router/routePaths';
import { useSearchStore } from '../store/search/searchStore';
import type { NaverMapHandle } from '../types/map';
import { buildMarkerViewModels } from '../utils/mapMarkerViewModel';

const DEFAULT_MAP_ZOOM = 14;

const MapPage = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const includePartiallyPossible = useSearchStore((s) => s.includePartiallyPossible);
  const navigate = useNavigate();
  const mapRef = useRef<NaverMapHandle | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [openedMarkerPopoverId, setOpenedMarkerPopoverId] = useState<string | null>(null);
  const [isFavoriteFilterActive] = useState(false);
  const {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    isLoading,
    errorMessage,
    markers,
    roomCoordById,
    results,
    branchSummary,
    favoriteBizItemIds,
  } = useMapPageSearch();

  const markerViewModels = useMemo(
    () =>
      buildMarkerViewModels({
        branchSummary,
        results,
        selectedRoomId,
        includePartiallyPossible,
        isFavoriteFilterActive,
        favoriteBizItemIds,
      }),
    [
      branchSummary,
      favoriteBizItemIds,
      includePartiallyPossible,
      isFavoriteFilterActive,
      results,
      selectedRoomId,
    ]
  );

  const handleSelectRoom = useCallback(
    (id: string) => {
      if (id === selectedRoomId) return;
      setSelectedRoomId(id);
      if (!isCarouselOpen) {
        setIsCarouselOpen(true);
      }
      if (openedMarkerPopoverId !== null) {
        setOpenedMarkerPopoverId(null);
      }
      const coord = roomCoordById[id];
      if (!coord) return;
      mapRef.current?.panTo(coord.lat, coord.lng);
    },
    [isCarouselOpen, openedMarkerPopoverId, roomCoordById, selectedRoomId]
  );

  const handleMarkerClick = useCallback(
    (markerId: string) => {
      const marker = markerViewModels.find((item) => item.id === markerId);
      if (!marker) return;

      mapRef.current?.panTo(marker.lat, marker.lng);

      if (marker.rooms.length <= 1) {
        const onlyRoom = marker.rooms[0];
        if (!onlyRoom) return;
        handleSelectRoom(onlyRoom.id);
        return;
      }

      if (isCarouselOpen) {
        setIsCarouselOpen(false);
      }
      setOpenedMarkerPopoverId((prev) => (prev === markerId ? null : markerId));
    },
    [handleSelectRoom, isCarouselOpen, markerViewModels]
  );

  const handleMarkerRoomClick = useCallback(
    (roomId: string) => {
      setOpenedMarkerPopoverId(null);
      handleSelectRoom(roomId);
    },
    [handleSelectRoom]
  );

  const resetSelectionUiState = useCallback(() => {
    setSelectedRoomId(null);
    if (isCarouselOpen) {
      setIsCarouselOpen(false);
    }
    if (openedMarkerPopoverId !== null) {
      setOpenedMarkerPopoverId(null);
    }
  }, [isCarouselOpen, openedMarkerPopoverId]);

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
            onClick={() => handleSearchHere(resetSelectionUiState)}
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
          markerViewModels={markerViewModels}
          openedMarkerPopoverId={openedMarkerPopoverId}
          selectedMarkerId={selectedRoomId}
          onMarkerClick={handleMarkerClick}
          onMarkerRoomClick={handleMarkerRoomClick}
          onViewportChange={handleViewportChange}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};

export default MapPage;
