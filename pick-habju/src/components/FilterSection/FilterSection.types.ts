export interface FilterSectionProps {
  isPartialFilterActive?: boolean;
  onPartialFilterToggle?: (isActive: boolean) => void;
  onFavoriteFilterToggle?: (isActive: boolean) => void;
  isFavoriteFilterActive?: boolean;
}
