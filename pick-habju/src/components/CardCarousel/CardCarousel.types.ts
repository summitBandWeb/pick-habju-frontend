import type { RoomMetadata } from '../../types/RoomMetadata';

export interface CardCarouselProps {
  rooms: RoomMetadata[]; // 전체 합주실 목록
  selectedRoomId: string | null; // 현재 선택된 합주실 ID
  /** 캐러셀 표시 여부. 마커 클릭 시 true, 새 검색/필터 시 또는 지도 빈 영역 클릭 시 false. */
  isOpen: boolean;
  onCardChange: (id: string) => void; // 슬라이드 넘김 -> 지도 핀 변경
  forceDevice?: 'mobile' | 'desktop'; // (선택) 강제 디바이스 모드 (테스트용)
}
