import type { BranchSummaryInfo, RoomAvailabilityResult } from '../api/api.types';
import type { MarkerRoomItem, MarkerViewModel } from '../types/map';

/** 지도 마커 뷰모델 생성 시 필요한 인자. 필터·선택 상태·즐겨찾기 등. */
export type BuildMarkerViewModelsArgs = {
  branchSummary: Record<string, BranchSummaryInfo> | undefined;
  results: RoomAvailabilityResult[] | undefined;
  selectedRoomId: string | null;
  includePartiallyPossible: boolean;
  isFavoriteFilterActive: boolean;
  favoriteBizItemIds: Set<string>;
};

/** 가격을 한국어 로케일 포맷 문자열로 변환. 유효하지 않으면 '0'. */
const formatPriceText = (price: number): string => {
  return Number.isFinite(price) ? price.toLocaleString('ko-KR') : '0';
};

/** available_slots 중 하나라도 true이면 true. 부분 가능 여부 판별용. */
const hasAnyAvailableSlot = (slots: Record<string, boolean> | undefined): boolean => {
  if (!slots) return false;
  return Object.values(slots).some((v) => v === true);
};

/** RoomAvailabilityResult → MarkerRoomItem. 가격 텍스트, 부분 가능, 즐겨찾기 상태 포함. */
const toMarkerRoomItem = (
  item: RoomAvailabilityResult,
  favoriteBizItemIds: Set<string>
): MarkerRoomItem => {
  const roomId = item.room_detail.biz_item_id;
  const isPartial = item.available === false && hasAnyAvailableSlot(item.available_slots);

  return {
    id: roomId,
    name: item.room_detail.name,
    priceText: formatPriceText(item.room_detail.price_per_hour),
    lat: item.room_detail.lat,
    lng: item.room_detail.lng,
    isPartial,
    favorite: favoriteBizItemIds.has(roomId) ? 'on' : 'off',
  };
};

/** 부분 가능 포함/즐겨찾기 필터에 따라 마커(지점) 노출 여부 판별. */
const isVisibleByFilters = (
  isPartial: boolean,
  favorite: 'on' | 'off',
  includePartiallyPossible: boolean,
  isFavoriteFilterActive: boolean
): boolean => {
  const partialMatched = !includePartiallyPossible || isPartial;
  const favoriteMatched = !isFavoriteFilterActive || favorite === 'on';
  return partialMatched && favoriteMatched;
};

/**
 * 검색 결과·필터·선택 상태를 바탕으로 지도 마커용 뷰모델 배열 생성.
 * - results를 businessId별로 그룹핑 후, 지점당 하나의 MarkerViewModel 생성.
 * - includePartiallyPossible / isFavoriteFilterActive 에 따라 노출 여부 필터링.
 * - selectedRoomId와 일치하는 룸이 있으면 해당 지점 마커를 isActive로 표시.
 */
export const buildMarkerViewModels = ({
  branchSummary,
  results,
  selectedRoomId,
  includePartiallyPossible,
  isFavoriteFilterActive,
  favoriteBizItemIds,
}: BuildMarkerViewModelsArgs): MarkerViewModel[] => {
  if (!results || results.length === 0) {
    return [];
  }

  const roomsByBusinessId = new Map<string, RoomAvailabilityResult[]>();
  for (const item of results) {
    const businessId = item.room_detail.business_id;
    const list = roomsByBusinessId.get(businessId);
    if (list) {
      list.push(item);
    } else {
      roomsByBusinessId.set(businessId, [item]);
    }
  }

  const markerViewModels: MarkerViewModel[] = [];

  for (const [businessId, groupedRooms] of roomsByBusinessId.entries()) {
    if (groupedRooms.length === 0) continue;

    const first = groupedRooms[0];
    const summary = branchSummary?.[businessId];
    const rooms = groupedRooms.map((room) => toMarkerRoomItem(room, favoriteBizItemIds));

    const isPartial = rooms.some((room) => room.isPartial);
    const favorite: 'on' | 'off' = rooms.some((room) => room.favorite === 'on') ? 'on' : 'off';
    const isActive =
      selectedRoomId !== null &&
      rooms.some((room) => String(room.id) === String(selectedRoomId));

    if (
      !isVisibleByFilters(
        isPartial,
        favorite,
        includePartiallyPossible,
        isFavoriteFilterActive
      )
    ) {
      continue;
    }

    const fallbackMinPrice = Math.min(
      ...groupedRooms.map((room) => room.room_detail.price_per_hour).filter((price) => Number.isFinite(price))
    );

    markerViewModels.push({
      id: businessId,
      lat: summary?.lat ?? first.room_detail.lat,
      lng: summary?.lng ?? first.room_detail.lng,
      priceText: formatPriceText(summary?.min_price ?? fallbackMinPrice),
      isPartial,
      favorite,
      isActive,
      extraRoomCount: Math.max(rooms.length - 1, 0),
      rooms,
    });
  }

  return markerViewModels;
};

