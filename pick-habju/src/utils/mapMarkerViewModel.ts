import type { Branch, RoomDetail } from '../api/api.types';
import type { MarkerRoomItem, MarkerViewModel } from '../types/map';

/** 지도 마커 뷰모델 생성 시 필요한 인자. 필터·즐겨찾기 등. isActive는 NaverMap에서 별도 관리. */
export type BuildMarkerViewModelsArgs = {
  branches: Branch[] | undefined;
  isPartialFilterActive: boolean;
  isFavoriteFilterActive: boolean;
  favoriteBizItemIds: Set<string>;
  searchText?: string;
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

/** RoomDetail → MarkerRoomItem. 가격 텍스트, 부분 가능, 즐겨찾기 상태 포함. */
const toMarkerRoomItem = (room: RoomDetail, favoriteBizItemIds: Set<string>): MarkerRoomItem => {
  const roomId = room.biz_item_id;
  const isPartial = room.available === false && hasAnyAvailableSlot(room.available_slots);

  return {
    id: roomId,
    name: room.name,
    priceText: formatPriceText(room.estimated_price),
    isPartial,
    favorite: favoriteBizItemIds.has(roomId) ? 'on' : 'off',
  };
};

/** 부분 가능 포함 필터에 따라 마커(지점) 노출 여부 판별. */
const isRoomMatchedByFilters = (room: MarkerRoomItem, isPartialFilterActive: boolean): boolean => {
  const partialMatched = isPartialFilterActive ? room.isPartial : !room.isPartial;
  return partialMatched;
};

/**
 * 검색 결과·필터를 바탕으로 지도 마커용 뷰모델 배열 생성.
 * - branches를 순회하여 지점당 하나의 MarkerViewModel 생성.
 * - isPartialFilterActive / searchText 에 따라 노출 여부 필터링.
 * - isActive는 항상 false. NaverMap의 active 상태 전용 effect에서 별도 관리.
 */
export const buildMarkerViewModels = ({
  branches,
  isPartialFilterActive,
  isFavoriteFilterActive,
  favoriteBizItemIds,
  searchText,
}: BuildMarkerViewModelsArgs): MarkerViewModel[] => {
  if (!branches || branches.length === 0) {
    return [];
  }

  const markerViewModels: MarkerViewModel[] = [];
  const normalizedSearch = searchText?.trim().toLowerCase() ?? '';

  for (const branch of branches) {
    if (!branch.rooms || branch.rooms.length === 0) continue;

    if (normalizedSearch && !branch.branch.toLowerCase().includes(normalizedSearch)) {
      continue;
    }

    const rooms = branch.rooms.map((room) => toMarkerRoomItem(room, favoriteBizItemIds));
    const visibleRooms = rooms.filter((room) => isRoomMatchedByFilters(room, isPartialFilterActive));

    if (visibleRooms.length === 0) continue;

    const isPartial = visibleRooms.some((room) => room.isPartial);
    const favorite: 'on' | 'off' =
      isFavoriteFilterActive && rooms.some((room) => room.favorite === 'on') ? 'on' : 'off';

    markerViewModels.push({
      id: branch.business_id,
      name: branch.branch,
      lat: branch.lat,
      lng: branch.lng,
      priceText: formatPriceText((isPartialFilterActive ? branch.min_price_partial : branch.min_price_available) ?? 0),
      isPartial,
      favorite,
      isActive: false,
      extraRoomCount: Math.max(visibleRooms.length - 1, 0),
      rooms: visibleRooms,
    });
  }

  return markerViewModels;
};
