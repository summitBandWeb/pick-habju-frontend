import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardCarousel from '../components/CardCarousel/CardCarousel';
import type { CardCarouselRoom } from '../components/CardCarousel/CardCarousel.types';
import FilterSection from '../components/FilterSection/FilterSection';
import NaverMap from '../components/Map/NaverMap';
import { useMapPageSearch } from '../hook/useMapPageSearch';
import RoutePaths from '../router/routePaths';
import { useSearchStore } from '../store/search/searchStore';
import type { NaverMapHandle } from '../types/map';
import { buildMarkerViewModels } from '../utils/mapMarkerViewModel';

const DEFAULT_MAP_ZOOM = 14;

const MapPage = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const navigate = useNavigate();
  const mapRef = useRef<NaverMapHandle | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [openedMarkerPopoverId, setOpenedMarkerPopoverId] = useState<string | null>(null);
  const [isPartialFilterActive, setIsPartialFilterActive] = useState(false);
  const [isFavoriteFilterActive, setIsFavoriteFilterActive] = useState(false);
  const {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    isLoading,
    errorMessage,
    markers,
    roomCoordById,
    roomsById,
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
        isPartialFilterActive,
        isFavoriteFilterActive,
        favoriteBizItemIds,
      }),
    [
      branchSummary,
      favoriteBizItemIds,
      isPartialFilterActive,
      isFavoriteFilterActive,
      results,
      selectedRoomId,
    ]
  );

  const selectedMarkerId = useMemo(() => {
    if (!selectedRoomId) return null;
    return (
      markerViewModels.find((marker) => marker.rooms.some((room) => room.id === selectedRoomId))?.id ?? null
    );
  }, [markerViewModels, selectedRoomId]);

  const carouselRooms = useMemo<CardCarouselRoom[]>(() => {
    const orderedUniqueRoomIds = Array.from(
      new Set(
        markerViewModels.flatMap((marker) =>
          marker.rooms
            .filter((room) => {
              const partialMatched = isPartialFilterActive ? room.isPartial : !room.isPartial;
              const favoriteMatched = !isFavoriteFilterActive || room.favorite === 'on';
              return partialMatched && favoriteMatched;
            })
            .map((room) => String(room.id))
        )
      )
    );

    return orderedUniqueRoomIds
      .map((roomId) => roomsById[roomId]?.room_detail)
      .filter((roomDetail): roomDetail is NonNullable<typeof roomDetail> => Boolean(roomDetail))
      .map((roomDetail) => ({
        name: roomDetail.name,
        branch: roomDetail.branch,
        businessId: roomDetail.business_id,
        bizItemId: roomDetail.biz_item_id,
        imageUrls: roomDetail.image_urls,
        recommendCapacity: roomDetail.recommend_capacity,
        pricePerHour: roomDetail.price_per_hour,
      }));
  }, [isFavoriteFilterActive, isPartialFilterActive, markerViewModels, roomsById]);

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

  const handleCardChange = useCallback(
    (id: string) => {
      handleSelectRoom(id);
    },
    [handleSelectRoom]
  );

  const handleMarkerClick = useCallback(
    (markerId: string) => {
      if (markerId === selectedMarkerId) return;

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
    [handleSelectRoom, isCarouselOpen, markerViewModels, selectedMarkerId]
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

  const filterChangeGuardRef = useRef({
    isPartialFilterActive,
    isFavoriteFilterActive,
  });
  useEffect(() => {
    const prev = filterChangeGuardRef.current;
    const filterChanged =
      prev.isPartialFilterActive !== isPartialFilterActive ||
      prev.isFavoriteFilterActive !== isFavoriteFilterActive;

    if (filterChanged) {
      resetSelectionUiState();
    }

    filterChangeGuardRef.current = {
      isPartialFilterActive,
      isFavoriteFilterActive,
    };
  }, [isFavoriteFilterActive, isPartialFilterActive, resetSelectionUiState]);

  useEffect(() => {
    if (!lastQuery) {
      navigate(RoutePaths.HOME, { replace: true });
    }
  }, [lastQuery, navigate]);

  useEffect(() => {
    if (!selectedRoomId) return;
    if (roomCoordById[selectedRoomId]) return;

    setSelectedRoomId(null);
    if (isCarouselOpen) {
      setIsCarouselOpen(false);
    }
  }, [isCarouselOpen, roomCoordById, selectedRoomId]);

  useEffect(() => {
    if (carouselRooms.length > 0) return;
    if (isCarouselOpen) {
      setIsCarouselOpen(false);
    }
  }, [carouselRooms.length, isCarouselOpen]);

  if (!lastQuery) {
    return null;
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <FilterSection
          isPartialFilterActive={isPartialFilterActive}
          onPartialFilterToggle={setIsPartialFilterActive}
          isFavoriteFilterActive={isFavoriteFilterActive}
          onFavoriteFilterToggle={setIsFavoriteFilterActive}
        />
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

      <div className="relative flex-1">
        <NaverMap
          ref={mapRef}
          initialCenter={lastQuery.center}
          initialZoom={DEFAULT_MAP_ZOOM}
          markers={markers}
          markerViewModels={markerViewModels}
          openedMarkerPopoverId={openedMarkerPopoverId}
          selectedMarkerId={selectedMarkerId}
          onMarkerClick={handleMarkerClick}
          onMarkerRoomClick={handleMarkerRoomClick}
          onViewportChange={handleViewportChange}
          className="h-full w-full"
        />
        {carouselRooms.length > 0 && (
          <CardCarousel
            rooms={carouselRooms}
            selectedRoomId={selectedRoomId}
            isOpen={isCarouselOpen}
            onCardChange={handleCardChange}
          />
        )}
      </div>
    </div>
  );
};

export default MapPage;
