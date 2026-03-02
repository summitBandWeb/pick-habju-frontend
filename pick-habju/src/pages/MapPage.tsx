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

const DEFAULT_MAP_ZOOM = 16;

/**
 * 지도 기반 합주실 검색 페이지.
 * - 마커 클릭 → 룸 선택 → 캐러셀 표시의 선택 흐름을 관리.
 * - partial/favorite 필터, 브랜치명 검색 텍스트를 마커 뷰모델 빌더에 전달.
 * - lastQuery가 없으면 홈으로 redirect (직접 URL 진입 방지).
 */
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
    branches,
    favoriteBizItemIds,
  } = useMapPageSearch();

  /** 필터·검색 텍스트 적용 후 지도에 표시할 마커 뷰모델 목록 */
  const markerViewModels = useMemo(
    () =>
      buildMarkerViewModels({
        branches,
        isPartialFilterActive,
        isFavoriteFilterActive,
        favoriteBizItemIds,
        searchText,
      }),
    [branches, favoriteBizItemIds, isPartialFilterActive, isFavoriteFilterActive, searchText]
  );

  /**
   * 선택된 룸이 속한 마커 ID → NaverMap에서 해당 마커 아이콘을 active 상태로 표시.
   * 팝오버가 열린 마커도 active 상태로 표시한다 (룸 미선택 상태에서 팝오버를 열었을 때).
   */
  const selectedMarkerId = useMemo(() => {
    if (openedMarkerPopoverId) return openedMarkerPopoverId;
    if (!selectedRoomId) return null;
    return markerViewModels.find((marker) => marker.rooms.some((room) => room.id === selectedRoomId))?.id ?? null;
  }, [markerViewModels, openedMarkerPopoverId, selectedRoomId]);

  /** 캐러셀에 표시할 룸 목록. 현재 마커 뷰모델에 포함된 룸만 roomsById에서 조회. */
  const carouselRooms = useMemo<CardCarouselRoom[]>(() => {
    const roomIds = markerViewModels.flatMap((marker) => marker.rooms.map((room) => room.id));

    return [...new Set(roomIds)]
      .map((roomId) => roomsById[roomId])
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

  /**
   * 룸 선택 핸들러. 캐러셀을 열고 팝오버를 닫으며, 다른 룸으로 이동할 때만 panTo 실행.
   * @param id 선택할 룸의 bizItemId
   */
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
      const roomDetail = roomsById[id];
      if (!roomDetail) return;
      mapRef.current?.panTo(roomDetail.lat, roomDetail.lng);
    },
    [isCarouselOpen, openedMarkerPopoverId, roomsById, selectedRoomId]
  );

  /**
   * 캐러셀 스와이프로 활성 카드가 바뀔 때 호출. 해당 룸을 선택 상태로 전환.
   * @param id 새로 활성화된 슬라이드의 bizItemId
   */
  const handleCardChange = useCallback(
    (id: string) => {
      handleSelectRoom(id);
    },
    [handleSelectRoom]
  );

  /**
   * 마커 클릭 핸들러.
   * - 단일 룸 마커: 해당 룸을 바로 선택.
   * - 복수 룸 마커: 팝오버 토글 (같은 마커 재클릭 시 닫힘).
   * @param markerId 클릭된 마커의 businessId
   */
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

  /**
   * 팝오버(PriceList) 내 룸 클릭 핸들러. 팝오버를 닫은 뒤 해당 룸을 선택.
   * @param roomId 클릭된 룸의 bizItemId
   */
  const handleMarkerRoomClick = useCallback(
    (roomId: string) => {
      setOpenedMarkerPopoverId(null);
      handleSelectRoom(roomId);
    },
    [handleSelectRoom]
  );


  /** 지도 드래그·줌 시작 시 열린 팝오버를 닫는다. */
  const handleMapInteractionStart = useCallback(() => {
    if (openedMarkerPopoverId !== null) {
      setOpenedMarkerPopoverId(null);
    }
  }, [openedMarkerPopoverId]);

  /** 선택 UI 초기화. 선택된 룸·캐러셀·팝오버를 모두 닫는다. 지도 빈 영역 클릭·필터 변경 시 사용. */
  const resetSelectionUiState = useCallback(() => {
    setSelectedRoomId(null);
    setIsCarouselOpen(false);
    setOpenedMarkerPopoverId(null);
  }, []);

  // 필터·검색 텍스트 변경 시 선택 UI 초기화.
  useEffect(() => {
    resetSelectionUiState();
  }, [isFavoriteFilterActive, isPartialFilterActive, resetSelectionUiState]);

  useEffect(() => {
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
        onViewportChange={handleViewportChange}
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
          <SearchHereButton onClick={() => handleSearchHere(resetSelectionUiState)} />
        </div>
      )}
    </div>
  );
};

export default MapPage;
