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
  /** 룸이 2개 이상인 마커를 클릭했을 때, 그 지점(businessId)의 팝오버를 열기 위해 사용. 값이 있으면 NaverMap에서 해당 마커에 InfoWindow(PriceList) 표시. 같은 마커 다시 클릭 시 null로 토글하여 닫음. */
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

  /**
   * 마커 클릭 시 분기:
   * - 룸이 1개: 해당 룸을 바로 선택(handleSelectRoom)하고 캐러셀 열기. 팝오버는 사용하지 않음.
   * - 룸이 2개 이상: openedMarkerPopoverId를 토글. 이미 열린 마커면 null로 닫고, 다른 마커면 해당 markerId로 열어서 NaverMap에서 그 마커 위에 룸 리스트 팝오버 표시.
   * 공통: 클릭한 마커 위치로 지도 panTo.
   */
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

  /** 팝오버(InfoWindow) 안에서 룸 행을 클릭했을 때 호출. 팝오버를 닫고 해당 roomId로 룸 선택(캐러셀 열기·panTo). NaverMap의 domready 리스너에서 addEventListener로 바인딩된 클릭이 이 콜백을 호출함. */
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
