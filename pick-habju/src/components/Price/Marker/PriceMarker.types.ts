/** 마커 표시 단계: 1=아이콘+텍스트 / 2=아이콘만 / 3=점 마커 */
export type PriceMarkerLevel = 1 | 2 | 3;

/** 지도 마커 컴포넌트 props */
export interface PriceMarkerProps {
  /** 표시 단계: 1=아이콘+텍스트, 2=아이콘만, 3=점 */
  level: PriceMarkerLevel;
  /** 업체명 (level 1 텍스트 영역에 표시) */
  name: string;
  /** 가격 텍스트 (level 1 텍스트 영역에 표시, 예: "29,000~") */
  price: string;
  /** 즐겨찾기 여부 */
  isFave: boolean;
  /** 부분예약 여부 */
  isPartial: boolean;
  /** 선택(활성) 상태 */
  isActive: boolean;
  /**
   * 추가 룸 수. 0이면 chip 숨김.
   * 표시되는 숫자는 extraRoomCount + 1 (전체 룸 수).
   */
  extraRoomCount: number;
}
