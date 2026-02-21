export interface PriceChipProps {
  /** 추가로 묶인 룸 개수 */
  count: number;
  /** 활성(선택) 상태일 때 칩·텍스트 크기 확대 */
  isActive?: boolean;
  /** 커스텀 클래스 */
  className?: string;
}
