export interface FavoriteButtonProps {
  isActive?: boolean;
  onToggle?: (nextValue: boolean) => void;
  disabled?: boolean;
}
