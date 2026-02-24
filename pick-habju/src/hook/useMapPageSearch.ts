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
import type { MapMarker, MapViewport } from '../types/map';
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

  /**
   * 지도 컴포넌트(NaverMap)에 넘길 "마커 목록" 데이터.
   * 형태: [{ id, lat, lng }, ...]
   * NaverMap 내부에서 실제 마커를 찍을 때 그대로 사용.
   * 소스: API 응답의 room_detail.biz_item_id, room_detail.lat, room_detail.lng
   */
  const markers = useMemo<MapMarker[]>(() => {
    const results = roomAvailabilityQuery.data?.result?.results;
    if (!results) return [];

    return results
      .map((item) => ({
        id: item.room_detail.biz_item_id,
        lat: item.room_detail.lat,
        lng: item.room_detail.lng,
      }))
      .filter(
        (marker) =>
          marker.id.length > 0 && Number.isFinite(marker.lat) && Number.isFinite(marker.lng)
      );
  }, [roomAvailabilityQuery.data]);

  /**
   * 방 ID로 좌표를 빠르게 찾기 위한 인덱스(lookup map).
   * 형태: { [id]: { lat, lng } }
   * handleSelectRoom(id)에서 id만 받아도 즉시 좌표를 찾아 mapRef.current?.panTo(...) 할 수 있게 함.
   * 매번 배열에서 find하지 않아도 되어 O(1) 조회.
   */
  const roomCoordById = useMemo<Record<string, { lat: number; lng: number }>>(() => {
    return markers.reduce<Record<string, { lat: number; lng: number }>>((acc, marker) => {
      acc[marker.id] = { lat: marker.lat, lng: marker.lng };
      return acc;
    }, {});
  }, [markers]);

  return {
    showSearchHereButton,
    handleViewportChange,
    handleSearchHere,
    isLoading: roomAvailabilityQuery.isFetching,
    errorMessage,
    data: roomAvailabilityQuery.data,
    markers,
    roomCoordById,
  };
};
