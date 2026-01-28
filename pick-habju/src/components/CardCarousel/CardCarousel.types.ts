import type { RoomMetadata } from '../../types/RoomMetadata'; 

export interface CardCarouselProps {
  rooms: RoomMetadata[];           // 전체 합주실 목록
  selectedRoomId: string | null;   // 현재 선택된 합주실 ID
  isOpen: boolean;                 // 캐러셀 표시 여부 (검색/필터 시 false)
  onCardChange: (id: string) => void; // 슬라이드 넘김 -> 지도 핀 변경
  onClose?: () => void;            // (선택) 닫기 동작 필요 시
}