import type { FilterSectionProps } from './FilterSection.types';
import TimeIcon from '../../assets/svg/Time.svg?react';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

/**
 * 지도 검색 결과 필터 버튼 영역.
 * - '일부 시간만 가능' 토글과 찜한 합주실 필터를 제공.
 * - partial/favorite 필터 상태를 외부에서 제어(controlled)한다.
 */
const FilterSection = ({
  isPartialFilterActive = false,
  onPartialFilterToggle,
  onFavoriteFilterToggle,
  isFavoriteFilterActive = false,
  partialDisabled = false,
  favoriteDisabled = false,
}: FilterSectionProps) => {
  return (
    <div className="flex items-center gap-2.5 w-fit h-12">
      <button
        type="button"
        disabled={partialDisabled}
        className={`h-10 rounded-[6.25rem] shadow-filter px-4 py-2.5 flex gap-1.25 items-center outline-none border border-transparent transition-colors disabled:cursor-not-allowed ${
          isPartialFilterActive
            ? 'bg-gray-600 text-primary-white [&_path]:fill-primary-white'
            : 'bg-primary-white text-gray-300 hover:bg-gray-200 [&_path]:fill-gray-300'
        }`}
        onClick={() => onPartialFilterToggle?.(!isPartialFilterActive)}
      >
        <TimeIcon className="w-3 h-3 shrink-0" />
        <span className="font-modal-call whitespace-nowrap">일부 시간만 가능</span>
      </button>
      <FavoriteButton
        isActive={isFavoriteFilterActive}
        onToggle={onFavoriteFilterToggle}
        disabled={favoriteDisabled}
      />
    </div>
  );
};

export default FilterSection;
