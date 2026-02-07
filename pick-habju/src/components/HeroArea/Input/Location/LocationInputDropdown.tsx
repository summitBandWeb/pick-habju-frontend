'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import LocationIcon from '../../../../assets/svg/location.svg';

export interface LocationOption {
  value: string;
  label: string;
  /** 역에 연결된 노선 정보 (예: "4호선·7호선"). */
  subwayLine: string;
}

/** "4호선·7호선" 형태의 문자열에서 노선 번호 배열 추출 */
function parseSubwayLineNumbers(subwayLine: string): number[] {
  const matches = subwayLine.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

const SUBWAY_LINE_BG_CLASSES: Record<number, string> = {
  1: 'bg-subway-line-1',
  2: 'bg-subway-line-2',
  3: 'bg-subway-line-3',
  4: 'bg-subway-line-4',
  5: 'bg-subway-line-5',
  6: 'bg-subway-line-6',
  7: 'bg-subway-line-7',
  8: 'bg-subway-line-8',
  9: 'bg-subway-line-9',
};

export interface LocationInputDropdownProps {
  /** 현재 선택된 지역 표시 텍스트 */
  location: string;
  /** 지역 옵션 목록 */
  options: LocationOption[];
  /** 지역 선택 시 호출. true 반환 시 드롭다운 닫힘 */
  onSelect: (value: string) => boolean | void;
  disabled?: boolean;
}

const LocationInputDropdown = ({
  location,
  options,
  onSelect,
  disabled = false,
}: LocationInputDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  }, [disabled]);

  const handleSelect = useCallback(
    (value: string) => {
      const shouldClose = onSelect(value);
      if (shouldClose !== false) {
        setIsOpen(false);
      }
    },
    [onSelect]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // --- Input 영역 렌더 (DateTimeInput과 동일 스타일) ---
  const renderInputArea = () => {
    const handleInputKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
    };
    return (
      <div
        className="h-14 w-full flex items-center justify-between py-1 px-3.5 cursor-pointer select-none bg-primary-white"
        role="button"
        tabIndex={0}
        aria-label="지역 변경"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={handleToggle}
        onKeyDown={handleInputKeyDown}
      >
        <div className="flex items-center justify-center text-primary-black font-hero-info gap-2">
          <img src={LocationIcon} alt="Location Icon" />
          <p>{location}</p>
        </div>
        <span
          className={`px-3 py-4 font-hero-edit underline underline-offset-2 ${isOpen ? 'text-blue-300' : 'text-blue-500'}`}
        >
          변경
        </span>
      </div>
    );
  };

  // --- Dropdown 영역 렌더 (피그마: default / hover / clicked 스타일) ---
  const renderDropdownArea = () => (
    <div className="flex flex-col bg-primary-white">
      <ul role="listbox" aria-label="지역 선택" className="flex flex-col">
        {options.map((opt, index) => {
          const isLast = index === options.length - 1;
          const lineNumbers = opt.subwayLine ? parseSubwayLineNumbers(opt.subwayLine) : [];
          return (
            <li
              key={opt.value}
              role="option"
              className={`
                group min-h-[48px] px-10.5 py-4 cursor-pointer
                flex items-center gap-2.5
                bg-primary-white
                border-t border-b border-gray-200
                transition-colors duration-150
                hover:bg-gray-200
                active:bg-gray-200
                ${isLast ? 'rounded-b-[8px] border-b-0' : ''}
              `}
              onClick={() => handleSelect(opt.value)}
            >
              <span
                className={`
                  font-modal-default text-gray-500
                  transition-all duration-150
                  group-hover:!text-[17px]
                  group-active:text-primary-black group-active:!text-[17px]
                `}
              >
                {opt.label}
              </span>
              {lineNumbers.length > 0 && (
                <div className="flex items-center gap-1">
                  {lineNumbers.map((num) => (
                    <span
                      key={num}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold leading-none text-white ${SUBWAY_LINE_BG_CLASSES[num] ?? 'bg-gray-400'}`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className={`flex flex-col w-[19.875rem] min-w-[14.375rem] rounded-lg border-2 border-gray-200 overflow-hidden shadow-search`}
    >
      {renderInputArea()}
      {isOpen && renderDropdownArea()}
    </div>
  );
};

export default LocationInputDropdown;
