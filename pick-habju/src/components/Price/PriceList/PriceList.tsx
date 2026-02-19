import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { PriceListProps } from './PriceList.types';

const ANIMATION_STEP_MS = 110;
const ANIMATION_DURATION_MS = 220;

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
  const normalizedRooms = useMemo(() => rooms.filter((room) => room.name && room.priceText), [rooms]);

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
