import type { FilterSectionProps } from './FilterSection.types';
import PartiallyPossibleButton from '../PartiallyPossibleButton/PartiallyPossibleButton';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

const FilterSection = ({ onFavoriteFilterToggle, isFavoriteFilterActive = false }: FilterSectionProps) => {
  return (
    <div className="flex items-center gap-2.5 w-91.5 h-12">
      <PartiallyPossibleButton />
      <FavoriteButton 
        isActive={isFavoriteFilterActive} 
        onToggle={onFavoriteFilterToggle} 
      />
    </div>
  );
};

export default FilterSection;
