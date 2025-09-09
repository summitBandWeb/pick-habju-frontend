export enum SortType {
  PRICE_LOW = 'price-low',
  PRICE_HIGH = 'price-high',
  CAPACITY_LOW = 'capacity-low',
  CAPACITY_HIGH = 'capacity-high',
}

export const SORT_OPTIONS = [
  { value: SortType.PRICE_LOW, label: '가격 낮은순' },
  { value: SortType.PRICE_HIGH, label: '가격 높은순' },
  { value: SortType.CAPACITY_LOW, label: '수용인원 낮은순' },
  { value: SortType.CAPACITY_HIGH, label: '수용인원 높은순' },
] as const;
