/**
 * 가격 라벨 컴포넌트
 * 지도 마커에서 가격을 표시하고, 즐겨찾기/추가 룸 개수 칩을 함께 렌더링합니다.
 */
import WonIcon from '../../../assets/svg/won.svg?react';
import FaveChipDefaultIcon from '../../../assets/svg/FaveChipDefault.svg?react';
import PriceChip from '../PriceChip/PriceChip';
import type { FavoriteState, PriceLabelProps } from './PriceLabel.types';

/** 즐겨찾기 상태별 마커 배경/모서리 클래스 */
const MARKER_BG_CLASS_BY_FAVORITE: Record<FavoriteState, string> = {
  off: 'bg-primary-white rounded-[0.9375rem]',
  on: 'bg-yellow-700 rounded-tr-[0.9375rem] rounded-br-[0.9375rem] rounded-bl-[0.9375rem]',
};

/** 부분/즐겨찾기 상태에 따른 기본 텍스트 색상 클래스 반환 */
const getBaseTextColorClass = (isPartial: boolean, favorite: FavoriteState) => {
  if (isPartial) {
    return favorite === 'on' ? 'text-gray-500' : 'text-gray-400';
  }
  return 'text-gray-600';
};

/** 즐겨찾기·활성 상태에 따른 원화 아이콘 크기 클래스 반환 */
const getWonIconSizeClass = (favorite: FavoriteState, isActive: boolean) => {
  if (favorite === 'off') {
    return `${isActive ? 'w-5 h-[1.0625rem]' : 'w-[0.8125rem] h-3'} shrink-0 transition-all group-hover/price:w-5 group-hover/price:h-[1.0625rem]`;
  }

  return 'w-[0.8125rem] h-3 shrink-0';
};

/** 활성·기본 텍스트 색상에 따른 원화 아이콘 색상 클래스 반환 */
const getWonIconColorClass = (isActive: boolean, baseTextColorClass: string) => {
  return `transition-colors group-hover/price:text-gray-600 ${baseTextColorClass} ${isActive ? 'text-gray-600' : ''}`;
};

/** 부분·활성 상태에 따른 즐겨찾기 아이콘 색상 클래스 반환 */
const getFaveIconColorClass = (isPartial: boolean, isActive: boolean) => {
  if (isActive) return 'text-gray-600';
  return isPartial ? 'text-gray-500' : 'text-gray-600';
};

const PriceLabel = ({
  priceText,
  isPartial = false,
  favorite = 'off',
  extraRoomCount = 0,
  isActive = false,
  onClick,
  className = '',
}: PriceLabelProps) => {
  const hasFavorite = favorite === 'on';
  const hasRoomChip = extraRoomCount > 0;
  const baseTextColorClass = getBaseTextColorClass(isPartial, favorite);
  const wonIconSizeClass = getWonIconSizeClass(favorite, isActive);
  const wonIconColorClass = getWonIconColorClass(isActive, baseTextColorClass);
  const faveIconColorClass = getFaveIconColorClass(isPartial, isActive);

  return (
    <div className={`inline-block relative pt-2.5 ${className}`}>
      <div className="group/price relative inline-flex items-start">
        <button
          type="button"
          onClick={onClick}
          aria-pressed={isActive}
          className={`${isActive ? 'h-[3.125rem]' : 'h-10'} px-5 py-2.5 border ${isActive && favorite === 'off' ? 'border-gray-600' : 'border-transparent'} shadow-price transition-all group-hover/price:h-[3.125rem] ${favorite === 'off' ? 'group-hover/price:border-gray-600' : ''} flex items-center justify-center gap-0.5 ${MARKER_BG_CLASS_BY_FAVORITE[favorite]} cursor-pointer`}
        >
          <WonIcon className={`${wonIconSizeClass} ${wonIconColorClass} [&_path]:fill-current`} aria-hidden />
          <span
            className={`${isActive ? 'text-[1.1875rem]' : 'text-sm'} font-semibold leading-none tracking-[0.03em] whitespace-nowrap transition-all group-hover/price:text-[1.1875rem] group-hover/price:text-gray-600 ${isActive ? 'text-gray-600' : baseTextColorClass}`}
          >
            {priceText}
          </span>
        </button>

        {hasRoomChip && (
          <PriceChip
            count={extraRoomCount + 1}
            isActive={isActive}
            className="absolute top-0 right-[-0.3125rem] group-hover/price:right-[-0.625rem]"
          />
        )}
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

export type { FavoriteState, PriceLabelProps } from './PriceLabel.types';
export default PriceLabel;
