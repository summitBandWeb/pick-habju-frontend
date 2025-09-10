import { SortType } from './FilterSection.constants';

export interface FilterSectionProps {
  onSortChange?: (sortType: SortType) => void;
  sortValue?: SortType;
}

export interface SortOption {
  value: SortType;
  label: string;
}
