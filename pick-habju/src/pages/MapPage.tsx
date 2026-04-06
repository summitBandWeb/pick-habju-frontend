import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseISO } from 'date-fns';
import CardCarousel from '../components/CardCarousel/CardCarousel';
import type { CardCarouselRoom } from '../components/CardCarousel/CardCarousel.types';
import ErrorNotice from '../components/ErrorNotice/ErrorNotice';
import FilterSection from '../components/FilterSection/FilterSection';
import MapLoadingSkeleton from '../components/Map/MapLoadingSkeleton/MapLoadingSkeleton';
import NaverMap from '../components/Map/NaverMap';
import SearchBar from '../components/SearchBar/SearchBar';
import SearchHereButton from '../components/SearchHereButton/SearchHereButton';
import { useMapPageSearch } from '../hook/useMapPageSearch';
import RoutePaths from '../router/routePaths';
import { useSearchStore } from '../store/search/searchStore';
import useReservationStore from '../store/dateTime/reservationStore';
import type { NaverMapHandle } from '../types/map';
import { formatSearchConditionDateTime } from '../utils/dateTimeLabel';
import { buildMarkerViewModels } from '../utils/mapMarkerViewModel';
import PartialReservationConfirmModal from '../components/Modal/Portion/PartialReservationConfirmModal';
import OneHourCallReservationNoticeModal from '../components/Modal/OneHour/OneHourCallReservationNoticeModal';
import OneHourChatReservationNoticeModal from '../components/Modal/OneHour/OneHourChatReservationNoticeModal';
import CallReservationNoticeModal from '../components/Modal/Call/CallReservationNoticeModal';
import { resolveModalFromWarnings } from '../utils/modalFlowLogic';
import type { ModalType } from '../utils/modalFlowLogic';
import { formatAvailableTimeRange, formatTimeRangeForCard } from '../utils/availableTimeFormatter';
import { getBookingUrl } from '../utils/bookingUrl';
import BookModalStepper from '../components/Modal/Book/BookModal';
import PastTimeUpdateModal from '../components/Modal/Time/PastTimeUpdateModal';
import ToastMessage from '../components/ToastMessage/ToastMessage';

const DEFAULT_MAP_ZOOM = 16;

// ── panTo 오프셋 상수 ─────────────────────────────────────────────────────────
// 검색바+필터 오버레이(상단)와 캐러셀(하단)을 제외한 가시 영역 중앙에 마커를 위치시킴.
// 캐러셀 높이: SearchHereButton 위치 기준과 동일한 18.5rem = 296px
// 상단 오버레이 높이: p-3(12) + SearchBar(44) + gap-3(12) + FilterSection(36) + p-3(12) ≈ 116px
const MAP_CAROUSEL_H = 18.5 * 16; // 296px
const MAP_TOP_INSET = 116; // px
const PANTO_OFFSET_Y = (MAP_CAROUSEL_H - MAP_TOP_INSET) / 2; // ≈ 90px

/**
 * 지도 기반 합주실 검색 페이지.
 * - 마커 클릭 → 룸 선택 → 캐러셀 표시의 선택 흐름을 관리.
 * - partial/favorite 필터, 브랜치명 검색 텍스트를 마커 뷰모델 빌더에 전달.
 * - lastQuery가 없으면 홈으로 redirect (직접 URL 진입 방지).
 */
const MapPage = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const reservationActions = useReservationStore((s) => s.actions);
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const mapRef = useRef<NaverMapHandle | null>(null);
  /** 마커 클릭 시 panTo를 캐러셀 애니메이션 이후로 미루기 위한 타이머. */
  const panToTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // ── 선택 상태 ──
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);

  // ── 필터 상태 ──
  const [isPartialFilterActive, setIsPartialFilterActive] = useState(false);
  const [isFavoriteFilterActive, setIsFavoriteFilterActive] = useState(false);

  // ── 검색 텍스트 (브랜치명 필터) ──
  const [searchText, setSearchText] = useState('');

  // ── 재검색 추적 ("여기서 검색" 클릭 후 결과 없음 시 ErrorNotice 억제) ──
  const [isReSearch, setIsReSearch] = useState(false);

  // ── 모달 상태 ──
  const [currentModal, setCurrentModal] = useState<{
    type: Exclude<ModalType, 'book'>;
    bizItemId: string;
    availableTime?: string;
    studioName?: string;
    phoneNumber?: string;
  } | null>(null);
  const [bookModal, setBookModal] = useState<{ bizItemId: string } | null>(null);

  // ── 검색 결과 (hook) ──
  const {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    isLoading,
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

  /** API 결과가 없거나, 필터 없이도 표시할 방이 없음 (모든 방이 일부 시간만 가능인 경우 포함).
   * 재검색("여기서 검색")으로 결과가 없는 경우는 ErrorNotice 없이 빈 지도만 표시. */
  const hasNoResults =
    !isLoading &&
    !isReSearch &&
    (branches.length === 0 ||
      (!isPartialFilterActive && !isFavoriteFilterActive && !searchText && markerViewModels.length === 0));

  /** noResults ErrorNotice 닫기(돌아가기·자동 숨김 공용). stable reference 유지를 위해 memoize. */
  const handleNoResultsClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /** 필터·검색 변경 핸들러 */
  const handlePartialFilterToggle = useCallback((isActive: boolean) => {
    setIsPartialFilterActive(isActive);
  }, []);
  const handleFavoriteFilterToggle = useCallback((isActive: boolean) => {
    setIsFavoriteFilterActive(isActive);
  }, []);
  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  /**
   * 선택된 마커 ID. useMemo 파생값 대신 독립 state로 관리.
   * 마커 클릭 시 즉시 업데이트(NaverMap 아이콘 교체)하고,
   * 캐러셀 slideToLoop는 startTransition으로 뒤에 실행해 두 작업이 프레임을 나눠 쓰도록 한다.
   */
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

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
        recommendCapacityRange: roomDetail.recommend_capacity_range,
        estimatedPrice: roomDetail.estimated_price,
        pricePerHour: roomDetail.price_per_hour,
        partialAvailable: isPartialFilterActive,
        availableTimeRange: isPartialFilterActive
          ? formatTimeRangeForCard(formatAvailableTimeRange(roomDetail.available_slots))
          : undefined,
      }));
  }, [isPartialFilterActive, markerViewModels, roomsById]);

  /**
   * 룸 선택 핸들러. 상태 업데이트만 담당하며 panTo는 호출하지 않는다.
   * panTo는 각 호출처(handleMarkerClick, handleCardChange)에서 타이머로 지연 실행.
   * @param id 선택할 룸의 bizItemId
   */
  const handleSelectRoom = useCallback(
    (id: string) => {
      if (id !== selectedRoomId) setSelectedRoomId(id);
      if (!isCarouselOpen) setIsCarouselOpen(true);
    },
    [isCarouselOpen, selectedRoomId]
  );

  /**
   * 캐러셀 스와이프로 활성 카드가 바뀔 때 호출.
   * startTransition으로 낮은 우선순위를 부여해 Swiper CSS 애니메이션 프레임을 보호한다.
   * panTo는 Swiper 전환 애니메이션 완료 후 onSwipeTransitionEnd에서 처리한다.
   * @param id 새로 활성화된 슬라이드의 bizItemId
   */
  const handleCardChange = useCallback(
    (id: string) => {
      startTransition(() => {
        const markerId =
          markerViewModels.find((marker) => marker.rooms.some((room) => room.id === id))?.id ?? null;
        setSelectedMarkerId(markerId);
        handleSelectRoom(id);
      });
    },
    [handleSelectRoom, markerViewModels]
  );

  /**
   * Swiper 슬라이드 전환 애니메이션이 완전히 끝난 뒤 호출 (스와이프 및 프로그래매틱 이동 포함).
   * 슬라이드 애니메이션과 panTo 애니메이션이 겹치지 않아 프레임 드롭 없이 지도가 이동한다.
   * @param id 전환 완료된 슬라이드의 bizItemId
   */
  const handleSlideTransitionEnd = useCallback(
    (id: string) => {
      const roomDetail = roomsById[id];
      if (!roomDetail) return;
      mapRef.current?.panTo(roomDetail.lat, roomDetail.lng, PANTO_OFFSET_Y);
    },
    [roomsById]
  );

  /**
   * 마커 클릭 핸들러. 찜한 룸을 우선으로 선택하여 캐러셀을 바로 표시.
   *
   * 렌더링 분리 전략 (마커 클릭 시 캐러셀 slideToLoop 버벅임 방지):
   * 1. setSelectedMarkerId(markerId) → 즉시 실행: NaverMap 마커 아이콘 교체
   * 2. startTransition → handleSelectRoom(roomId): 캐러셀 slideToLoop는 다음 여유 프레임에서 실행
   *    → 두 작업이 같은 프레임을 두고 경쟁하지 않아 슬라이딩 버벅임 감소
   *
   * panTo 전략:
   * - 캐러셀이 이미 열려있는 경우: slideToLoop 완료 후 onSlideChangeTransitionEnd →
   *   handleSlideTransitionEnd 에서 panTo. (캐러셀 스와이프와 동일한 경로)
   * - 캐러셀이 닫혀있는 경우: Framer Motion spring 입장 애니메이션(~300ms) 동안
   *   slideToLoop이 발생하지 않으므로 350ms 후 직접 panTo.
   * @param markerId 클릭된 마커의 businessId
   */
  const handleMarkerClick = useCallback(
    (markerId: string) => {
      if (panToTimerRef.current) {
        clearTimeout(panToTimerRef.current);
        panToTimerRef.current = null;
      }
      const marker = markerViewModels.find((item) => item.id === markerId);
      if (!marker) return;

      // 가격 일치 + 찜 → 찜(가격 무관) → 가격 일치 → 첫 번째 룸
      const priceMatchedRooms = marker.rooms.filter((room) => room.priceText === marker.priceText);
      const roomToSelect =
        priceMatchedRooms.find((room) => room.favorite === 'on') ??
        marker.rooms.find((room) => room.favorite === 'on') ??
        priceMatchedRooms[0] ??
        marker.rooms[0];
      if (!roomToSelect) return;

      const carouselWasOpen = isCarouselOpen;

      // ① 즉시: 마커 하이라이트만 교체 (NaverMap DOM 업데이트)
      setSelectedMarkerId(markerId);

      // 같은 룸을 다시 클릭한 경우 캐러셀·panTo 로직은 불필요
      if (roomToSelect.id === selectedRoomId) return;

      // ② 지연: 캐러셀 slideToLoop (①의 DOM 업데이트와 프레임을 분리)
      startTransition(() => {
        handleSelectRoom(roomToSelect.id);
      });

      if (!carouselWasOpen) {
        const roomDetail = roomsById[roomToSelect.id];
        if (!roomDetail) return;
        panToTimerRef.current = setTimeout(() => {
          panToTimerRef.current = null;
          mapRef.current?.panTo(roomDetail.lat, roomDetail.lng, PANTO_OFFSET_Y);
        }, 350);
      }
      // carouselWasOpen 인 경우: slideToLoop → onSlideChangeTransitionEnd → handleSlideTransitionEnd 에서 panTo
    },
    [handleSelectRoom, isCarouselOpen, markerViewModels, roomsById, selectedRoomId]
  );

  /** 선택 UI 초기화. 선택된 룸·마커·캐러셀·모달을 모두 닫는다. 지도 빈 영역 클릭·필터 변경 시 사용. */
  const resetSelectionUiState = useCallback(() => {
    if (panToTimerRef.current) {
      clearTimeout(panToTimerRef.current);
      panToTimerRef.current = null;
    }
    setSelectedMarkerId(null);
    setSelectedRoomId(null);
    setIsCarouselOpen(false);
    setCurrentModal(null);
    setBookModal(null);
  }, []);

  /**
   * 예약하기 버튼 클릭 핸들러.
   * - partial 필터 활성 시: PartialReservationConfirmModal
   * - policy_warnings 기반: oneHourChat / oneHourCall / sameDayCall 모달
   * - 그 외(일반 예약): 예약 URL 직접 오픈 (BookModalStepper는 추후 리팩토링 예정)
   */
  const handleBookClick = useCallback(
    (bizItemId: string) => {
      if (!lastQuery) return;
      const roomDetail = roomsById[bizItemId];
      if (!roomDetail) return;

      if (isPartialFilterActive) {
        const availableTime = formatAvailableTimeRange(roomDetail.available_slots);
        if (!availableTime) return;
        setCurrentModal({ type: 'partial', bizItemId, availableTime });
        return;
      }

      const modalType = resolveModalFromWarnings(roomDetail.policy_warnings);
      if (modalType === 'book') {
        setBookModal({ bizItemId });
        return;
      }

      setCurrentModal({
        type: modalType,
        bizItemId,
        studioName: roomDetail.display_name ?? roomDetail.branch,
        phoneNumber: roomDetail.phone_number ?? '',
      });
    },
    [isPartialFilterActive, lastQuery, roomsById]
  );

  /** "여기서 검색" 클릭 시: 선택 UI·필터·검색어를 초기화한 뒤 재검색. */
  const handleSearchHereClick = useCallback(() => {
    setIsReSearch(true);
    handleSearchHere(() => {
      resetSelectionUiState();
      setIsPartialFilterActive(false);
      setIsFavoriteFilterActive(false);
      setSearchText('');
    });
  }, [handleSearchHere, resetSelectionUiState]);

  // 언마운트 시 panTo 타이머 정리.
  useEffect(() => {
    return () => {
      if (panToTimerRef.current) clearTimeout(panToTimerRef.current);
    };
  }, []);

  // 필터·검색 텍스트 변경 시 선택 UI 초기화.
  useEffect(() => {
    resetSelectionUiState();
  }, [isFavoriteFilterActive, isPartialFilterActive, searchText, resetSelectionUiState]);

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

    setSelectedMarkerId(null);
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
      {isLoading && !isReSearch && <MapLoadingSkeleton />}
      {hasNoResults && <ErrorNotice type="noResults" onClose={handleNoResultsClose} autoHideAfter={6000} />}
      <NaverMap
        ref={mapRef}
        initialCenter={lastQuery.center}
        initialZoom={DEFAULT_MAP_ZOOM}
        markerViewModels={markerViewModels}
        selectedMarkerId={selectedMarkerId}
        onMarkerClick={handleMarkerClick}
        onViewportChange={handleViewportChange}
        onMapEmptyClick={resetSelectionUiState}
        className="h-full w-full"
      />

      {/* 검색바 + 필터 — 지도 위 float 오버레이 */}
      {/* pointer-events-none: 컨테이너 패딩·gap 빈 영역이 지도 클릭을 막지 않도록. 자식 래퍼는 pointer-events-auto로 복원하되, flex stretch로 full-width가 되는 래퍼는 w-fit으로 빈 공간이 지도를 막지 않게 해야 함. */}
      <div className="absolute left-0 right-0 top-0 z-[60] flex flex-col gap-3 p-3 pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar
            value={searchText}
            onSearchChange={handleSearchChange}
            searchCondition={searchCondition}
            onConditionClick={() => {
              // DatePicker가 lastQuery 날짜를 초기값으로 표시하도록 store에 미리 세팅
              if (lastQuery) {
                reservationActions.setDate([parseISO(lastQuery.date)]);
                reservationActions.setHourSlotsRaw(lastQuery.hour_slots);
              }
              navigate(RoutePaths.HOME);
            }}
          />
        </div>
        <div className="pointer-events-auto w-fit">
          <FilterSection
            isPartialFilterActive={isPartialFilterActive}
            onPartialFilterToggle={handlePartialFilterToggle}
            isFavoriteFilterActive={isFavoriteFilterActive}
            onFavoriteFilterToggle={handleFavoriteFilterToggle}
          />
        </div>
      </div>

      {carouselRooms.length > 0 && (
        <CardCarousel
          rooms={carouselRooms}
          selectedRoomId={selectedRoomId}
          isOpen={isCarouselOpen}
          onCardChange={handleCardChange}
          onSlideTransitionEnd={handleSlideTransitionEnd}
          onBookClick={handleBookClick}
        />
      )}

      {/* 예약 모달 */}
      {currentModal &&
        lastQuery &&
        (() => {
          const roomDetail = roomsById[currentModal.bizItemId];
          const closeModal = () => setCurrentModal(null);
          const studioName = currentModal.studioName ?? '';
          const phoneNumber = currentModal.phoneNumber ?? '';

          switch (currentModal.type) {
            case 'partial':
              return (
                <PartialReservationConfirmModal
                  open
                  onClose={closeModal}
                  availableTime={currentModal.availableTime ?? ''}
                  onConfirm={() => {
                    if (!roomDetail) {
                      closeModal();
                      return;
                    }
                    const nextType = resolveModalFromWarnings(roomDetail.policy_warnings);
                    if (nextType === 'book') {
                      window.open(
                        getBookingUrl(
                          { businessId: roomDetail.business_id, bizItemId: roomDetail.biz_item_id },
                          lastQuery.date
                        ),
                        '_blank'
                      );
                      closeModal();
                    } else {
                      setCurrentModal({
                        type: nextType,
                        bizItemId: currentModal.bizItemId,
                        studioName: roomDetail.display_name ?? roomDetail.branch,
                        phoneNumber: roomDetail.phone_number ?? '',
                      });
                    }
                  }}
                />
              );

            case 'oneHourCall':
              return (
                <OneHourCallReservationNoticeModal
                  open
                  onClose={closeModal}
                  studioName={studioName}
                  phoneNumber={phoneNumber}
                  onConfirm={() => {
                    if (!roomDetail) {
                      closeModal();
                      return;
                    }
                    window.open(
                      getBookingUrl(
                        { businessId: roomDetail.business_id, bizItemId: roomDetail.biz_item_id },
                        lastQuery.date
                      ),
                      '_blank'
                    );
                    closeModal();
                  }}
                />
              );

            case 'oneHourChat':
              return (
                <OneHourChatReservationNoticeModal
                  open
                  onClose={closeModal}
                  onConfirm={() => {
                    if (!roomDetail) {
                      closeModal();
                      return;
                    }
                    window.open(
                      getBookingUrl(
                        { businessId: roomDetail.business_id, bizItemId: roomDetail.biz_item_id },
                        lastQuery.date
                      ),
                      '_blank'
                    );
                    closeModal();
                  }}
                />
              );

            case 'sameDayCall':
              return (
                <CallReservationNoticeModal
                  open
                  onClose={closeModal}
                  studioName={studioName}
                  phoneNumber={phoneNumber}
                />
              );

            default:
              return null;
          }
        })()}

      {/* 일반 예약 모달 (2단계) */}
      {bookModal &&
        lastQuery &&
        (() => {
          const room = roomsById[bookModal.bizItemId];
          if (!room) return null;
          return (
            <BookModalStepper
              open
              room={room}
              dateIso={lastQuery.date}
              hourSlots={lastQuery.hour_slots}
              peopleCount={lastQuery.peopleCount}
              onConfirm={() => setBookModal(null)}
              onClose={() => setBookModal(null)}
            />
          );
        })()}

      {/* 과거 시간 경과 모달 */}
      <PastTimeUpdateModal onConfirm={() => navigate(RoutePaths.HOME)} />

      {/* 토스트 (모달 위에 표시되도록 z-[80]) */}
      <div
        className="fixed left-0 right-0 z-[80] flex justify-center pointer-events-none"
        style={{ bottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <ToastMessage />
      </div>

      {showSearchHereButton && (
        <div
          className="absolute left-1/2 z-40 -translate-x-1/2 transition-all duration-300 ease-out"
          style={{
            bottom: isCarouselOpen
              ? 'calc(18.5rem + env(safe-area-inset-bottom, 0px))'
              : 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <SearchHereButton onClick={handleSearchHereClick} />
        </div>
      )}
    </div>
  );
};

export default MapPage;
