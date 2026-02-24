import type { FilterSectionProps } from './FilterSection.types';
import TimeIcon from '../../assets/svg/Time.svg?react';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

const FilterSection = ({
  isPartialFilterActive = false,
  onPartialFilterToggle,
  onFavoriteFilterToggle,
  isFavoriteFilterActive = false,
}: FilterSectionProps) => {
  return (
    <div className="flex items-center gap-2.5 w-91.5 h-12">
      <button
        type="button"
        className={`h-10 rounded-[6.25rem] shadow-filter px-4 py-2.5 flex gap-1.25 items-center outline-none border border-transparent transition-colors ${
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
      />
    </div>
  );
};

export default FilterSection;
