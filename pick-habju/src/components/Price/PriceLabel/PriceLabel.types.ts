/** 즐겨찾기 마커 상태 */
export type FavoriteState = 'on' | 'off';

/** 가격 라벨(마커) 컴포넌트 props */
export interface PriceLabelProps {
  /** 마커에 표시할 가격 텍스트 (예: 29,000 / 39,000~) */
  priceText: string;
  /** 부분(일부) 상태 여부 */
  isPartial?: boolean;
  /** 즐겨찾기 마커 상태 */
  favorite?: FavoriteState;
  /** 0보다 크면 추가 룸 개수 칩 표시 */
  extraRoomCount?: number;
  /** 마커 선택 여부 */
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}
