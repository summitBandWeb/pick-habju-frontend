import WonIcon from '../../../assets/svg/won.svg?react';
import FaveChipDefaultIcon from '../../../assets/svg/FaveChipDefault.svg?react';
import PriceChip from '../PriceChip/PriceChip';
import type {
  FavoriteState,
  PriceLabelProps,
  PriceLabelState,
  RoomChipState,
} from './PriceLabel.types';

const MARKER_BG_CLASS_BY_FAVORITE: Record<FavoriteState, string> = {
  off: 'bg-primary-white rounded-[0.9375rem]',
  on: 'bg-yellow-700 rounded-tr-[0.9375rem] rounded-br-[0.9375rem] rounded-bl-[0.9375rem]',
};

const WRAPPER_CLASS_BY_ROOM_CHIP: Record<RoomChipState, string> = {
  none: '',
  extra: 'pr-[0.9375rem]',
};

const getBaseTextColorClass = (state: PriceLabelState, favorite: FavoriteState) => {
  if (state === 'partial') {
    return favorite === 'on' ? 'text-gray-500' : 'text-gray-400';
  }
  return 'text-gray-600';
};

const getMarkerInteractionClass = (isActive: boolean, favorite: FavoriteState) => {
  if (!isActive) return '';
  return favorite === 'off' ? 'h-[3.125rem] border-gray-600' : 'h-[3.125rem]';
};

const getTextInteractionClass = (isActive: boolean) => {
  return isActive ? 'text-[1.1875rem] text-gray-600' : '';
};

const getWonIconSizeClass = (favorite: FavoriteState, isActive: boolean) => {
  if (favorite === 'off') {
    return `w-[0.8125rem] h-3 shrink-0 transition-all group-hover/price:w-5 group-hover/price:h-[1.0625rem] ${
      isActive ? 'w-5 h-[1.0625rem]' : ''
    }`;
  }

  return 'w-[0.8125rem] h-3 shrink-0';
};

const getWonIconColorClass = (isActive: boolean, baseTextColorClass: string) => {
  return `transition-colors group-hover/price:text-gray-600 ${baseTextColorClass} ${
    isActive ? 'text-gray-600' : ''
  }`;
};

const getFaveIconColorClass = (state: PriceLabelState, isActive: boolean) => {
  if (isActive) return 'text-gray-600';
  return state === 'partial' ? 'text-gray-500' : 'text-gray-600';
};

const PriceLabel = ({
  priceText,
  state = 'default',
  favorite = 'off',
  roomChip = 'none',
  extraRoomCount = 0,
  isActive = false,
  onClick,
  disabled = false,
  className = '',
}: PriceLabelProps) => {
  const hasFavorite = favorite === 'on';
  const hasRoomChip = roomChip === 'extra';
  const baseTextColorClass = getBaseTextColorClass(state, favorite);
  const markerInteractionClass = getMarkerInteractionClass(isActive, favorite);
  const textInteractionClass = getTextInteractionClass(isActive);
  const wonIconSizeClass = getWonIconSizeClass(favorite, isActive);
  const wonIconColorClass = getWonIconColorClass(isActive, baseTextColorClass);
  const faveIconColorClass = getFaveIconColorClass(state, isActive);

  return (
    <div className={`relative pt-2.5 ${className}`}>
      <div className={`group/price flex items-start justify-end ${WRAPPER_CLASS_BY_ROOM_CHIP[roomChip]}`}>
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-pressed={isActive}
          className={`h-10 px-5 py-2.5 border border-transparent shadow-price transition-all group-hover/price:h-[3.125rem] flex items-center justify-center gap-0.5 ${markerInteractionClass} ${hasRoomChip ? '-mr-[0.9375rem]' : ''} ${MARKER_BG_CLASS_BY_FAVORITE[favorite]} ${favorite === 'off' ? 'group-hover/price:border-gray-600' : ''} ${
            disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          }`}
        >
          <WonIcon
            className={`${wonIconSizeClass} ${wonIconColorClass} [&_path]:fill-current`}
            aria-hidden
          />
          <span
            className={`text-sm font-semibold leading-none tracking-[0.03em] whitespace-nowrap transition-all group-hover/price:text-[1.1875rem] group-hover/price:text-gray-600 ${textInteractionClass} ${baseTextColorClass}`}
          >
            {priceText}
          </span>
        </button>

        {hasRoomChip && <PriceChip count={extraRoomCount} isEmphasized={isActive} />}
      </div>

      {hasFavorite && (
        <div className="absolute left-0 top-0 w-5 h-5 rounded-[0.9375rem] bg-yellow-700 flex items-center justify-center">
          <FaveChipDefaultIcon
            aria-hidden
            className={`w-[1.125rem] h-[1.125rem] shrink-0 transition-colors ${faveIconColorClass} [&_path]:fill-current [&_path]:stroke-current`}
          />
        </div>
      )}
    </div>
  );
};

export type {
  FavoriteState,
  PriceLabelProps,
  PriceLabelState,
  RoomChipState,
} from './PriceLabel.types';
export default PriceLabel;
