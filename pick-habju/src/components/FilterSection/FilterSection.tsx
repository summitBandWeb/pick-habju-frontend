import { useState, useRef, useEffect } from 'react';
import WhiteFilterIcon from '../../assets/svg/whitefilter.svg';
import BlueFilterIcon from '../../assets/svg/bluefilter.svg';

import type { FilterSectionProps } from './FilterSection.types';
import { SORT_OPTIONS, SortType } from './FilterSection.constants';

const FilterSection = ({ SearchResultNumber, onSortChange, sortValue }: FilterSectionProps) => {
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
      <div className="font-modal-calctype">
        검색결과 <span className="text-blue-500">{SearchResultNumber ?? 'N'}</span>개
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          className={`flex items-center justify-between w-37.5 h-10 px-3 py-2 rounded-lg focus:outline-none shadow-filter ${
            isDropdownOpen ? 'bg-blue-500 text-primary-white' : 'bg-primary-white text-blue-500 hover:bg-blue-300'
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="font-modal-call">{SORT_OPTIONS.find((option) => option.value === selectedSort)?.label}</span>
          <img src={isDropdownOpen ? WhiteFilterIcon : BlueFilterIcon} alt="filter icon" className="w-4 h-4" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-37.5 bg-white  rounded-lg shadow-search z-10">
            <div className="h-2 rounded-t-lg"></div>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={`w-full px-3 py-2 text-left font-modal-calcdetail hover:bg-gray-200 ${
                  selectedSort === option.value
                    ? 'bg-primary-white text-blue-500 border-l-[0.125rem] border-blue-500'
                    : 'text-gray-400'
                }`}
                onClick={() => handleSortChange(option.value)}
              >
                {option.label}
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
