/** 가격 목록에 표시할 룸 항목 */
export interface PriceListRoom {
  id: string;
  name: string;
  priceText: string;
}

/** 가격 목록 컴포넌트 props */
export interface PriceListProps {
  /** 표시할 룸 목록 */
  rooms: PriceListRoom[];
  /** 목록 열림 여부 */
  isOpen?: boolean;
  className?: string;
  /** 룸 행 클릭 시 콜백 */
  onRoomClick?: (room: PriceListRoom) => void;
}
