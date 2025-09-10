import { useState, useRef, useEffect } from 'react';
import BlackFilterIcon from '../../assets/svg/BlackFilter.svg';
import FilterCheckIcon from '../../assets/svg/FilterCheck.svg';

import type { FilterSectionProps } from './FilterSection.types';
import { SORT_OPTIONS, SortType } from './FilterSection.constants';
import PartiallyPossibleButton from '../PartiallyPossibleButton/PartiallyPossibleButton';

const FilterSection = ({ onSortChange, sortValue }: FilterSectionProps) => {
  const [selectedSort, setSelectedSort] = useState(sortValue || SortType.PRICE_LOW);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // sortValue prop이 변경되면 내부 상태 동기화
  useEffect(() => {
    if (sortValue && sortValue !== selectedSort) {
      setSelectedSort(sortValue);
    }
  }, [sortValue, selectedSort]);

  const handleSortChange = (sortValue: SortType) => {
    setSelectedSort(sortValue);
    setIsDropdownOpen(false);
    if (onSortChange) {
      onSortChange(sortValue);
    }
  };

  return (
    <div className="flex justify-between items-center w-91.5 h-12">
      <PartiallyPossibleButton />
      <div className="relative" ref={dropdownRef}>
        <button
          className={`flex items-center justify-between w-37.5 h-10 px-3 py-2 rounded-lg focus:outline-none shadow-filter bg-primary-white hover:bg-gray-100 text-gray-600 border ${
            isDropdownOpen ? 'border-gray-600' : 'border-transparent'
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="font-modal-call">{SORT_OPTIONS.find((option) => option.value === selectedSort)?.label}</span>
          <img src={BlackFilterIcon} alt="filter icon" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-37.5 bg-white  rounded-lg shadow-search z-10">
            <div className="h-2 rounded-t-lg"></div>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`w-full px-3 py-2 text-left font-modal-calcdetail bg-primary-white hover:bg-gray-200 flex justify-between items-center ${
                  selectedSort === option.value ? 'text-gray-600' : 'text-gray-300'
                }`}
                onClick={() => handleSortChange(option.value)}
              >
                <span>{option.label}</span>
                {selectedSort === option.value && <img src={FilterCheckIcon} alt="selected" />}
              </button>
            ))}
            <div className="h-2 rounded-b-lg"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSection;
