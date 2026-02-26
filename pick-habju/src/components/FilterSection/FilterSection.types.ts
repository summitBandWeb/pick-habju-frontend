/**
 * FilterSection 컴포넌트 Props.
 * partial/favorite 필터 상태를 외부에서 제어(controlled)한다.
 */
export interface FilterSectionProps {
  /** '일부 시간만 가능' 필터 활성 여부 */
  isPartialFilterActive?: boolean;
  /** partial 필터 토글 시 호출. 다음 활성 상태를 인자로 전달. */
  onPartialFilterToggle?: (isActive: boolean) => void;
  /** favorite 필터 토글 시 호출. 다음 활성 상태를 인자로 전달. */
  onFavoriteFilterToggle?: (isActive: boolean) => void;
  /** '찜한 합주실만 보기' 필터 활성 여부 */
  isFavoriteFilterActive?: boolean;
}
