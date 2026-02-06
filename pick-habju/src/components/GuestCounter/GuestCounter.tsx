import { Minus, Plus } from 'lucide-react';
import classNames from 'classnames';
import type { GuestCounterProps } from './GuestCounter.types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToastStore } from '../../store/toast/toastStore';

const GuestCounter = ({ value, onChange, min = 1, max = 30 }: GuestCounterProps) => {
  const { showPersistentToast, hideToast } = useToastStore();
  const [inputValue, setInputValue] = useState(String(value));
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showTemporaryToast = useCallback(
    (message: string, duration = 1500) => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      showPersistentToast(message, 'error');
      toastTimerRef.current = setTimeout(() => {
        hideToast();
        toastTimerRef.current = null;
      }, duration);
    },
    [showPersistentToast, hideToast]
  );

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        hideToast();
      }
    };
  }, [hideToast]);

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(sanitizedValue, 10);
    if (!isNaN(numValue) && numValue > max) {
      setInputValue(String(max));
      onChange(max);
      showTemporaryToast(`${max}명 이상은 선택할 수 없습니다.`);
    } else if (!isNaN(numValue) && numValue <= 0) {
      setInputValue(String(min));
      onChange(min);
      showTemporaryToast(`${min}명 이하는 선택할 수 없습니다.`);
    } else {
      setInputValue(sanitizedValue);
    }
  };

  const handleBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < min) {
      const middleValue = Math.floor((min + max) / 2);
      onChange(middleValue);
      setInputValue(String(middleValue));
    } else if (numValue > max) {
      onChange(max);
      setInputValue(String(max));
    } else {
      onChange(numValue);
      setInputValue(String(numValue));
    }
  };

  return (
    <div className="flex items-center w-36 h-12 bg-primary-white font-modal-num border border-gray-400 rounded-sm overflow-hidden">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={classNames(
          'flex items-center justify-center w-12 h-full transition-colors',
          'hover:bg-gray-200 disabled:bg-gray-200 disabled:cursor-not-allowed',
          'border-r border-gray-400'
        )}
      >
        <Minus className="w-4 h-4 text-gray-400 stroke-3" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        className="w-12 h-full text-center text-primary-black bg-transparent border-none focus:outline-none focus:ring-0"
      />
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={classNames(
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
