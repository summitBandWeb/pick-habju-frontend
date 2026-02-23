/**
 * MapPage 전용 "오케스트레이션" 훅.
 *
 * - lastQuery를 읽고 API payload 생성
 * - useRoomAvailabilityQuery(payload) 실행 (초기/재호출)
 * - 지도 이동으로 들어온 현재 뷰포트를 draftViewport로 관리
 * - draftViewport가 기존 lastQuery.bounds를 벗어났는지 계산해 버튼 노출 여부 결정
 * - 버튼 클릭 시 lastQuery를 draft 값으로 커밋해서 재검색 트리거
 */
import { useCallback, useMemo, useState } from 'react';
import { useRoomAvailabilityQuery } from '../api/get/useRoomQueries';
import { useSearchStore } from '../store/search/searchStore';
import type { MapViewport } from '../types/map';
import {
  buildRoomAvailabilityPayload,
  isOutsideBaseBounds,
  mergeViewportToLastQuery,
} from '../utils/mapQuery';

export const useMapPageSearch = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const setLastQuery = useSearchStore((s) => s.setLastQuery);

  /** 지도 이동 시 현재 뷰포트(아직 검색에 반영되지 않은 draft) */
  const [draftViewport, setDraftViewport] = useState<MapViewport | null>(null);

  /** lastQuery → API 요청 DTO 변환 후 useRoomAvailabilityQuery 실행 (초기/재호출) */
  const payload = useMemo(() => buildRoomAvailabilityPayload(lastQuery), [lastQuery]);
  const roomAvailabilityQuery = useRoomAvailabilityQuery(payload);

  /** draftViewport가 lastQuery.bounds를 벗어났는지에 따라 "여기서 검색" 버튼 노출 여부 */
  const showSearchHereButton = useMemo(() => {
    if (!lastQuery || !draftViewport) return false;
    return isOutsideBaseBounds(draftViewport.bounds, lastQuery.bounds);
  }, [draftViewport, lastQuery]);

  /** 지도 뷰포트 변경 시 draftViewport 갱신 */
  const handleViewportChange = useCallback((viewport: MapViewport) => {
    setDraftViewport(viewport);
  }, []);

  /** lastQuery를 draft 뷰포트로 커밋 → 재검색 트리거, draft 초기화 */
  const handleSearchHere = useCallback(() => {
    if (!lastQuery || !draftViewport) return;
    setLastQuery(mergeViewportToLastQuery(lastQuery, draftViewport));
    setDraftViewport(null);
  }, [draftViewport, lastQuery, setLastQuery]);

  const errorMessage = useMemo(() => {
    if (!roomAvailabilityQuery.error) return null;
    if (roomAvailabilityQuery.error instanceof Error) return roomAvailabilityQuery.error.message;
    return 'Failed to fetch map availability';
  }, [roomAvailabilityQuery.error]);

  return {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    isLoading: roomAvailabilityQuery.isFetching,
    errorMessage,
    data: roomAvailabilityQuery.data,
  };
};
