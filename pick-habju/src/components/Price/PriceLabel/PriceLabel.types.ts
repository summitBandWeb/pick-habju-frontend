export type FavoriteState = 'on' | 'off';

export interface PriceLabelProps {
  /** Price text shown in marker (e.g. 29,000 / 39,000~) */
  priceText: string;
  /** Partial state */
  isPartial?: boolean;
  /** Favorite marker state */
  favorite?: FavoriteState;
  /** Show room chip when value is greater than 0 */
  extraRoomCount?: number;
  /** Keep hover style after click */
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}
