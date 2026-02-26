import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardCarousel from '../components/CardCarousel/CardCarousel';
import type { CardCarouselRoom } from '../components/CardCarousel/CardCarousel.types';
import FilterSection from '../components/FilterSection/FilterSection';
import NaverMap from '../components/Map/NaverMap';
import SearchBar from '../components/SearchBar/SearchBar';
import SearchHereButton from '../components/SearchHereButton/SearchHereButton';
import { useMapPageSearch } from '../hook/useMapPageSearch';
import RoutePaths from '../router/routePaths';
import { useSearchStore } from '../store/search/searchStore';
import type { NaverMapHandle } from '../types/map';
import { formatSearchConditionDateTime } from '../utils/dateTimeLabel';
import { buildMarkerViewModels } from '../utils/mapMarkerViewModel';

const DEFAULT_MAP_ZOOM = 14;

const MapPage = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const navigate = useNavigate();
  const mapRef = useRef<NaverMapHandle | null>(null);

  // ── 선택·팝오버 상태 ──
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [openedMarkerPopoverId, setOpenedMarkerPopoverId] = useState<string | null>(null);

  // ── 필터 상태 ──
  const [isPartialFilterActive, setIsPartialFilterActive] = useState(false);
  const [isFavoriteFilterActive, setIsFavoriteFilterActive] = useState(false);

  // ── 검색 텍스트 (브랜치명 필터) ──
  const [searchText, setSearchText] = useState('');

  // ── 검색 결과 (hook) ──
  const {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    roomsById,
    results,
    branchSummary,
    favoriteBizItemIds,
  } = useMapPageSearch();

  // 필터·검색 텍스트 적용 후 지도에 표시할 마커 뷰모델 목록
  const markerViewModels = useMemo(
    () =>
      buildMarkerViewModels({
        branchSummary,
        results,
        isPartialFilterActive,
        isFavoriteFilterActive,
        favoriteBizItemIds,
        searchText,
      }),
    [branchSummary, favoriteBizItemIds, isPartialFilterActive, isFavoriteFilterActive, results, searchText]
  );

  // 선택된 룸이 속한 마커 ID → NaverMap에서 해당 마커 아이콘을 active 상태로 표시.
  // 팝오버가 열린 마커도 active 상태로 표시한다 (룸 미선택 상태에서 팝오버를 열었을 때).
  const selectedMarkerId = useMemo(() => {
    if (openedMarkerPopoverId) return openedMarkerPopoverId;
    if (!selectedRoomId) return null;
    return markerViewModels.find((marker) => marker.rooms.some((room) => room.id === selectedRoomId))?.id ?? null;
  }, [markerViewModels, openedMarkerPopoverId, selectedRoomId]);

  // 캐러셀에 표시할 룸 목록: 현재 마커 뷰모델에 포함된 룸만 roomsById에서 조회
  const carouselRooms = useMemo<CardCarouselRoom[]>(() => {
    const roomIds = markerViewModels.flatMap((marker) => marker.rooms.map((room) => room.id));

    return [...new Set(roomIds)]
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
  }, [markerViewModels, roomsById]);

  // 룸 선택: 캐러셀 열기, 팝오버 닫기, 해당 좌표로 panTo (다른 룸으로 이동할 때만)
  const handleSelectRoom = useCallback(
    (id: string) => {
      const isSameRoom = id === selectedRoomId;
      if (!isSameRoom) {
        setSelectedRoomId(id);
      }
      if (!isCarouselOpen) {
        setIsCarouselOpen(true);
      }
      if (openedMarkerPopoverId !== null) {
        setOpenedMarkerPopoverId(null);
      }
      if (isSameRoom) return;
      const roomDetail = roomsById[id]?.room_detail;
      if (!roomDetail) return;
      mapRef.current?.panTo(roomDetail.lat, roomDetail.lng);
    },
    [isCarouselOpen, openedMarkerPopoverId, roomsById, selectedRoomId]
  );

  // 캐러셀 카드 변경 → 룸 선택
  const handleCardChange = useCallback(
    (id: string) => {
      handleSelectRoom(id);
    },
    [handleSelectRoom]
  );

  // 마커 클릭: 단일 룸 마커면 바로 선택, 복수 룸 마커면 팝오버 토글
  const handleMarkerClick = useCallback(
    (markerId: string) => {
      const marker = markerViewModels.find((item) => item.id === markerId);
      if (!marker) return;

      if (marker.rooms.length <= 1) {
        const onlyRoom = marker.rooms[0];
        if (!onlyRoom) return;
        handleSelectRoom(onlyRoom.id);
        return;
      }

      setOpenedMarkerPopoverId((prev) => (prev === markerId ? null : markerId));
    },
    [handleSelectRoom, markerViewModels]
  );

  // 팝오버 내 룸 클릭 → 팝오버 닫기 후 룸 선택
  const handleMarkerRoomClick = useCallback(
    (roomId: string) => {
      setOpenedMarkerPopoverId(null);
      handleSelectRoom(roomId);
    },
    [handleSelectRoom]
  );

  // 뷰포트 변경 → '이 위치에서 재검색' 버튼 표시 여부 갱신
  const handleMapViewportChange = useCallback(
    (viewport: Parameters<typeof handleViewportChange>[0]) => {
      handleViewportChange(viewport);
    },
    [handleViewportChange]
  );

  // 지도 드래그·줌 시작 시 팝오버 닫기
  const handleMapInteractionStart = useCallback(() => {
    if (openedMarkerPopoverId !== null) {
      setOpenedMarkerPopoverId(null);
    }
  }, [openedMarkerPopoverId]);

  // 선택 UI 초기화: 선택된 룸·캐러셀·팝오버를 모두 닫음
  const resetSelectionUiState = useCallback(() => {
    setSelectedRoomId(null);
    if (isCarouselOpen) {
      setIsCarouselOpen(false);
    }
    if (openedMarkerPopoverId !== null) {
      setOpenedMarkerPopoverId(null);
    }
  }, [isCarouselOpen, openedMarkerPopoverId]);

  // 맵 전체 초기화: 선택 UI + 필터 버튼 (재검색 시 사용)
  const resetMapUiState = useCallback(() => {
    resetSelectionUiState();
    if (isPartialFilterActive) {
      setIsPartialFilterActive(false);
    }
    if (isFavoriteFilterActive) {
      setIsFavoriteFilterActive(false);
    }
  }, [isFavoriteFilterActive, isPartialFilterActive, resetSelectionUiState]);

  // 필터 변경 시 선택 UI 초기화.
  // resetSelectionUiState를 deps에 넣으면 isCarouselOpen·openedMarkerPopoverId 변경 시에도
  // effect가 실행되므로, ref로 이전값을 직접 비교해 필터 변경 여부를 판단한다.
  const filterChangeGuardRef = useRef({
    isPartialFilterActive,
    isFavoriteFilterActive,
  });
  useEffect(() => {
    const prev = filterChangeGuardRef.current;
    const filterChanged =
      prev.isPartialFilterActive !== isPartialFilterActive || prev.isFavoriteFilterActive !== isFavoriteFilterActive;

    if (filterChanged) {
      resetSelectionUiState();
    }

    filterChangeGuardRef.current = {
      isPartialFilterActive,
      isFavoriteFilterActive,
    };
  }, [isFavoriteFilterActive, isPartialFilterActive, resetSelectionUiState]);

  // searchText 변경 시 선택 UI 초기화.
  // resetSelectionUiState가 deps에 있어 같은 searchText로도 재실행될 수 있으므로,
  // ref로 이전값을 비교해 실제 변경이 있을 때만 초기화한다.
  const prevSearchTextRef = useRef(searchText);
  useEffect(() => {
    if (prevSearchTextRef.current === searchText) return;
    prevSearchTextRef.current = searchText;
    resetSelectionUiState();
  }, [searchText, resetSelectionUiState]);

  // lastQuery 없으면 홈으로 redirect (직접 URL 접근 방지)
  useEffect(() => {
    if (!lastQuery) {
      navigate(RoutePaths.HOME, { replace: true });
    }
  }, [lastQuery, navigate]);

  // 선택된 룸이 검색 결과에서 사라지면 선택 해제 (재검색 등으로 결과 변경 시)
  useEffect(() => {
    if (!selectedRoomId) return;
    if (roomsById[selectedRoomId]) return;

    setSelectedRoomId(null);
    if (isCarouselOpen) {
      setIsCarouselOpen(false);
    }
  }, [isCarouselOpen, roomsById, selectedRoomId]);

  // 표시할 룸이 없으면 캐러셀 닫기
  useEffect(() => {
    if (carouselRooms.length > 0) return;
    if (isCarouselOpen) {
      setIsCarouselOpen(false);
    }
  }, [carouselRooms.length, isCarouselOpen]);

  if (!lastQuery) {
    return null;
  }

  const searchCondition = {
    location: lastQuery.location,
    peopleCount: lastQuery.peopleCount,
    dateTime: formatSearchConditionDateTime(lastQuery.date, lastQuery.hour_slots),
  };

  return (
    <div className="relative h-full w-full">
      <NaverMap
        ref={mapRef}
        initialCenter={lastQuery.center}
        initialZoom={DEFAULT_MAP_ZOOM}
        markerViewModels={markerViewModels}
        openedMarkerPopoverId={openedMarkerPopoverId}
        selectedMarkerId={selectedMarkerId}
        onMarkerClick={handleMarkerClick}
        onMarkerRoomClick={handleMarkerRoomClick}
        onViewportChange={handleMapViewportChange}
        onMapInteractionStart={handleMapInteractionStart}
        onMapEmptyClick={resetSelectionUiState}
        className="h-full w-full"
      />

      {/* 검색바 + 필터 — 지도 위 float 오버레이 */}
      <div className="absolute left-0 right-0 top-0 z-10 flex flex-col gap-3 p-3">
        <SearchBar
          value={searchText}
          onSearchChange={setSearchText}
          searchCondition={searchCondition}
          onConditionClick={() => navigate(RoutePaths.HOME)}
        />
        <FilterSection
          isPartialFilterActive={isPartialFilterActive}
          onPartialFilterToggle={setIsPartialFilterActive}
          isFavoriteFilterActive={isFavoriteFilterActive}
          onFavoriteFilterToggle={setIsFavoriteFilterActive}
        />
      </div>

      {carouselRooms.length > 0 && (
        <CardCarousel
          rooms={carouselRooms}
          selectedRoomId={selectedRoomId}
          isOpen={isCarouselOpen}
          onCardChange={handleCardChange}
        />
      )}
      {showSearchHereButton && (
        <div
          className={`absolute left-1/2 z-[60] -translate-x-1/2 transition-all duration-300 ease-out ${
            isCarouselOpen ? 'bottom-74' : 'bottom-6'
          }`}
        >
          <SearchHereButton onClick={() => handleSearchHere(resetMapUiState)} />
        </div>
      )}
    </div>
  );
};

export default MapPage;
