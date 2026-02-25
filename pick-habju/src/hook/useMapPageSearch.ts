import { useCallback, useMemo, useState } from 'react';
import type { BookingAPIResponse, BranchSummaryInfo, RoomAvailabilityResult } from '../api/api.types';
import { useFavoritesQuery } from '../api/get/useFavoritesQueries';
import { useRoomAvailabilityQuery } from '../api/get/useRoomQueries';
import { useDeviceId } from './useDeviceId';
import { useSearchStore } from '../store/search/searchStore';
import type { MapViewport } from '../types/map';
import {
  buildRoomAvailabilityPayload,
  isOutsideBaseBounds,
  mergeViewportToLastQuery,
} from '../utils/mapQuery';

/** 지도 페이지 검색 결과를 정규화한 타입. 룸·지점 ID별 맵으로 제공. */
export type MapAvailabilityNormalized = {
  results: RoomAvailabilityResult[];
  branchSummary: Record<string, BranchSummaryInfo>;
  roomsById: Record<string, RoomAvailabilityResult>;
};

/**
 * 예약 API 응답을 지도 페이지용으로 정규화.
 * - roomsById: O(1) 룸 조회용 맵 생성. 좌표가 없는 룸은 제외.
 */
const normalizeMapAvailability = (response: BookingAPIResponse): MapAvailabilityNormalized => {
  const results = response.result?.results ?? [];
  const branchSummary = response.result?.branch_summary ?? {};
  const roomsById: Record<string, RoomAvailabilityResult> = {};

  for (const item of results) {
    const roomId = item.room_detail.biz_item_id;
    if (!roomId || !Number.isFinite(item.room_detail.lat) || !Number.isFinite(item.room_detail.lng)) {
      continue;
    }
    roomsById[roomId] = item;
  }

  return { results, branchSummary, roomsById };
};

/**
 * 지도 페이지 검색/가용성 및 "여기서 검색" 동작을 담당하는 훅.
 * - lastQuery 기반 룸 가용성 조회, 응답 정규화(마커/지점/룸 맵).
 * - 지도 뷰포트 변경 시 draftViewport 갱신, 기준 영역 밖이면 "여기서 검색" 버튼 노출.
 * - 즐겨찾기 ID 목록은 favoriteBizItemIds로 제공.
 */
export const useMapPageSearch = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const setLastQuery = useSearchStore((s) => s.setLastQuery);
  const deviceId = useDeviceId();
  /** 지도 뷰포트 변경 시 임시 저장. "여기서 검색" 시 lastQuery에 반영 후 초기화. */
  const [draftViewport, setDraftViewport] = useState<MapViewport | null>(null);

  const payload = useMemo(() => buildRoomAvailabilityPayload(lastQuery), [lastQuery]);
  const roomAvailabilityQuery = useRoomAvailabilityQuery(payload, {
    select: normalizeMapAvailability,
  });
  const favoritesQuery = useFavoritesQuery(
    { deviceId: deviceId ?? '' },
    {
      enabled: Boolean(deviceId),
      select: (response) => response.result?.biz_item_ids ?? [],
    }
  );

  /** 현재 지도 영역이 마지막 검색 영역 밖이면 true → "여기서 검색" 버튼 표시. */
  const showSearchHereButton = useMemo(() => {
    if (!lastQuery || !draftViewport) return false;
    return isOutsideBaseBounds(draftViewport.bounds, lastQuery.bounds);
  }, [draftViewport, lastQuery]);

  /** 지도 뷰포트 변경 시 호출. draftViewport 갱신. */
  const handleViewportChange = useCallback((viewport: MapViewport) => {
    setDraftViewport(viewport);
  }, []);

  /** "여기서 검색" 클릭 시: draftViewport를 lastQuery에 반영 후 검색. onBeforeSearch는 검색 전 콜백(예: 캐러셀 닫기). */
  const handleSearchHere = useCallback((onBeforeSearch?: () => void) => {
    if (!lastQuery || !draftViewport) return;
    onBeforeSearch?.();
    setLastQuery(mergeViewportToLastQuery(lastQuery, draftViewport));
    setDraftViewport(null);
  }, [draftViewport, lastQuery, setLastQuery]);

  /** 룸 가용성 조회 실패 시 사용자에게 보여줄 메시지. */
  const errorMessage = useMemo(() => {
    if (!roomAvailabilityQuery.error) return null;
    if (roomAvailabilityQuery.error instanceof Error) return roomAvailabilityQuery.error.message;
    return 'Failed to fetch map availability';
  }, [roomAvailabilityQuery.error]);

  /** 즐겨찾기된 biz_item_id Set. 마커/캐러셀에서 하트 표시 등에 사용. */
  const favoriteBizItemIds = useMemo(
    () => new Set<string>(favoritesQuery.data ?? []),
    [favoritesQuery.data]
  );

  return {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    isLoading: roomAvailabilityQuery.isFetching,
    errorMessage,
    roomsById: roomAvailabilityQuery.data?.roomsById ?? {},
    branchSummary: roomAvailabilityQuery.data?.branchSummary ?? {},
    results: roomAvailabilityQuery.data?.results ?? [],
    favoriteBizItemIds,
  };
};

