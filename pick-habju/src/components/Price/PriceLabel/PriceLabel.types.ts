export type PriceLabelState = 'default' | 'partial';
export type FavoriteState = 'on' | 'off';
export type RoomChipState = 'none' | 'extra';

export interface PriceLabelProps {
  /** 금액 라벨 텍스트 (예: 29,000 / 39,000~) */
  priceText: string;
  /** 피그마 variant state */
  state?: PriceLabelState;
  /** 즐겨찾기 표시 */
  favorite?: FavoriteState;
  /** 룸 칩 표시 */
  roomChip?: RoomChipState;
  /** roomChip=extra 일 때 표시할 룸 개수 */
  extraRoomCount?: number;
  /** 선택 상태(클릭 후 hover 스타일 유지) */
  isActive?: boolean;
  /** 마커 클릭 핸들러 */
  onClick?: () => void;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 커스텀 클래스 */
  className?: string;
}
