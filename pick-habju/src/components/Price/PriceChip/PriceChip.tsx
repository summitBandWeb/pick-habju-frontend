/**
 * 가격 칩 컴포넌트
 * 추가로 묶인 룸 개수를 원형 칩으로 표시합니다. PriceLabel과 함께 사용됩니다.
 */
import type { PriceChipProps } from './PriceChip.types';

const PriceChip = ({ count, isActive = false, className = '' }: PriceChipProps) => {
  return (
    <div
      data-pm-chip
      className={`bg-gray-300 text-primary-white rounded-full ${isActive ? 'size-5' : 'size-[0.9375rem]'} p-[0.3125rem] flex items-center justify-center shrink-0 transition-all shadow-price ${className}`}
    >
      <span
        data-pm-chip-label
        className={`font-semibold leading-none tracking-[0.03em] transition-all ${isActive ? 'text-[1.1875rem]' : 'text-sm'}`}
      >
        {count}
      </span>
    </div>
  );
};

export type { PriceChipProps } from './PriceChip.types';
export default PriceChip;
