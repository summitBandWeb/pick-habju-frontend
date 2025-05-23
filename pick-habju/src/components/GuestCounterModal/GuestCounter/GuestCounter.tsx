import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
import type { GuestCounterProps } from './GuestCounter.types';

const GuestCounter = ({ value, onChange, min = 0, max = 15 }: GuestCounterProps) => {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex items-center w-36 h-12 bg-primary-white font-modal-num border border-gray-400 rounded-sm overflow-hidden">
      {/* - Button */}
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={clsx(
          'flex items-center justify-center w-12 h-full transition-colors',
          'hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed',
          'border-r border-gray-400'
        )}
      >
        <Minus className="w-4 h-4 text-gray-400 stroke-3" />
      </button>

      {/* Value Display */}
      <div className="flex items-center justify-center flex-1 h-full text-primary-black">{value}</div>

      {/* + Button */}
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={clsx(
          'flex items-center justify-center w-12 h-full transition-colors',
          'hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed',
          'border-l border-gray-400'
        )}
      >
        <Plus className="w-4 h-4 text-gray-400 stroke-3" />
      </button>
    </div>
  );
};

export default GuestCounter;
