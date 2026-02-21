/**
 * 가격 목록 컴포넌트
 * 마커 클릭 시 노출되는 룸별 가격 목록을 표시합니다. 항목별 등장 애니메이션을 적용합니다.
 */
import type { CSSProperties } from 'react';
import type { PriceListProps } from './PriceList.types';

/** 항목당 애니메이션 시작 지연(ms) */
const ANIMATION_STEP_MS = 110;
/** 개별 항목 애니메이션 지속 시간(ms) */
const ANIMATION_DURATION_MS = 220;

/** 인덱스·총 개수·지연·지속시간으로 항목 등장 애니메이션 스타일 반환 */
const getListItemAnimationStyle = (
  index: number,
  total: number,
  stepMs: number,
  durationMs: number,
): CSSProperties => {
  const reverseIndex = total - 1 - index;
  const delay = reverseIndex * stepMs;

  return {
    animationName: 'toast-in',
    animationDuration: `${durationMs}ms`,
    animationTimingFunction: 'ease-out',
    animationFillMode: 'both',
    animationDelay: `${delay}ms`,
  };
};

const PriceList = ({
  rooms,
  isOpen = false,
  className = '',
  onRoomClick,
}: PriceListProps) => {
  /** 타입에서 보장된 룸 목록을 그대로 사용 */
  const normalizedRooms = rooms;

  if (!isOpen || normalizedRooms.length === 0) {
    return null;
  }

  return (
    <div className={`w-[6.5rem] rounded-[0.9375rem] bg-primary-white shadow-price ${className}`}>
      {normalizedRooms.map((room, index) => {
        const isFirst = index === 0;
        const isLast = index === normalizedRooms.length - 1;

        const rowClass = [
          'group/row w-full px-2.5 py-2 flex items-center justify-between transition-colors bg-primary-white hover:bg-gray-100',
          !isLast ? 'border-b-[0.03125rem] border-gray-200' : '',
          isFirst ? 'rounded-tl-[0.9375rem] rounded-tr-[0.9375rem]' : '',
          isLast ? 'rounded-bl-[0.9375rem] rounded-br-[0.9375rem]' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={room.id}
            type="button"
            style={getListItemAnimationStyle(
              index,
              normalizedRooms.length,
              ANIMATION_STEP_MS,
              ANIMATION_DURATION_MS,
            )}
            className={rowClass}
            onClick={() => onRoomClick?.(room)}
          >
            <span className="text-[0.6875rem] font-medium leading-none tracking-[-0.01375rem] text-gray-300 group-hover/row:text-gray-400">
              {room.name}
            </span>
            <span className="text-sm font-semibold leading-none tracking-[0.03em] text-gray-400 group-hover/row:text-gray-600">
              {room.priceText}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export type { PriceListProps, PriceListRoom } from './PriceList.types';
export default PriceList;
