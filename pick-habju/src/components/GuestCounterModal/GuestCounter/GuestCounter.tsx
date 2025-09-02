import { Minus, Plus } from 'lucide-react';
import clsx from 'clsx';
import type { GuestCounterProps } from './GuestCounter.types';
import { useEffect, useState } from 'react';

const GuestCounter = ({ value, onChange, min = 1, max = 30 }: GuestCounterProps) => {
  // 내부 상태 추가: 입력창에 보여줄 값을 위한 별도의 state -> string 타입으로 관리
  // 부모로부터 받은 value prop을 초기값으로 설정합니다.
  const [inputValue, setInputValue] = useState(String(value));

  // 부모로부터 value prop이 변경될 때마다 inputValue를 동기화
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
    // 숫자가 아닌 모든 문자를 제거
    const sanitizedValue = e.target.value.replace(/[^0-9]/g, '');

    // 숫자로 변환해서 30을 넘으면 30으로 제한
    const numValue = parseInt(sanitizedValue, 10);
    if (!isNaN(numValue) && numValue > max) {
      setInputValue(String(max));
    } else if (!isNaN(numValue) && numValue <= 0) {
      setInputValue(String(min));
    } else {
      setInputValue(sanitizedValue);
    }
  };

  // onBlur 시점에 최종 유효성 검사 및 부모에게 값 전달
  const handleBlur = () => {
    // 입력값을 숫자로 변환
    const numValue = parseInt(inputValue, 10);

    // 입력값이 비어있거나 숫자가 아니면 중간값인 15로 설정
    // 비어있을 때만 동작할 것 (아마도) - 숫자가 아닌 것은 위에서 막고 있음 (handleChange) 방어코드로서 남겨둠
    if (isNaN(numValue) || numValue < min) {
      const middleValue = Math.floor((min + max) / 2); // 중간값을 정수로 계산
      onChange(middleValue); // 부모에게 중간값 전달
      setInputValue(String(middleValue)); // 화면에도 중간값 표기
    }
    // 최대값을 초과하면 max 값으로 설정
    else if (numValue > max) {
      onChange(max);
      setInputValue(String(max)); // 화면에도 max 값을 다시 표시
    }
    // 유효한 값이면 해당 값을 부모에게 전달
    else {
      onChange(numValue);
      setInputValue(String(numValue));
    }
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

      {/* Value Display -> Input으로 변경 */}
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
