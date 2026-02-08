import { useState, useEffect } from 'react';
import type { FilterSectionProps } from './FilterSection.types';
import PartiallyPossibleButton from '../PartiallyPossibleButton/PartiallyPossibleButton';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

const FilterSection = ({ onFavoriteFilterToggle, isFavoriteFilterActive: controlledValue }: FilterSectionProps) => {
  const [isFavoriteActive, setIsFavoriteActive] = useState(controlledValue || false);

  // 제어 컴포넌트로 사용될 때 외부 상태와 동기화
  useEffect(() => {
    if (controlledValue !== undefined) {
      setIsFavoriteActive(controlledValue);
    }
  }, [controlledValue]);

  const handleFavoriteToggle = (nextValue: boolean) => {
    setIsFavoriteActive(nextValue);
    onFavoriteFilterToggle?.(nextValue);
  };

  return (
    <div className="flex items-center gap-2.5 w-91.5 h-12">
      <PartiallyPossibleButton />
      <FavoriteButton isActive={isFavoriteActive} onToggle={handleFavoriteToggle} />
    </div>
  );
};

export default FilterSection;
