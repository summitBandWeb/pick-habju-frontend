/**
 * 가격 칩 컴포넌트
 * 추가로 묶인 룸 개수를 원형 칩으로 표시합니다. PriceLabel과 함께 사용됩니다.
 */
import type { PriceChipProps } from './PriceChip.types';

const PriceChip = ({ count, isActive = false, className = '' }: PriceChipProps) => {
  return (
    <div
      className={`bg-gray-300 text-primary-white rounded-full w-5 h-5 p-[0.3125rem] flex items-center justify-center shrink-0 transition-all group-hover/price:w-[1.5625rem] group-hover/price:h-[1.5625rem] ${isActive ? 'w-[1.5625rem] h-[1.5625rem]' : ''} ${className}`}
    >
      <span
        className={`text-sm font-semibold leading-none tracking-[0.03em] transition-all group-hover/price:text-[1.1875rem] ${isActive ? 'text-[1.1875rem]' : ''}`}
      >
        {count}
      </span>
    </div>
  );
};

export type { PriceChipProps } from './PriceChip.types';
export default PriceChip;
