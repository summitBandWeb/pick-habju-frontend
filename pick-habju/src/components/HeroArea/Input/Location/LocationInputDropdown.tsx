'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import LocationIcon from '../../../../assets/svg/location.svg';

export interface LocationOption {
  value: string;
  label: string;
  /** 역에 연결된 노선 정보 (예: "4호선·7호선"). "전체" 등 노선이 없는 경우 생략 가능 */
  subwayLine?: string;
}

export interface LocationInputDropdownProps {
  /** 현재 선택된 지역 표시 텍스트 */
  location: string;
  /** 지역 옵션 목록 */
  options: LocationOption[];
  /** 지역 선택 시 호출. true 반환 시 드롭다운 닫힘 */
  onSelect: (value: string) => boolean | void;
  onClose?: () => void;
  disabled?: boolean;
}

const LocationInputDropdown = ({
  location,
  options,
  onSelect,
  onClose,
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
    onClose?.();
    setIsOpen(false);
  }, [onClose]);

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

  // --- Dropdown 영역 렌더 ---
  const renderDropdownArea = () => (
    <div className="flex flex-col bg-primary-white">
      <ul role="listbox" aria-label="지역 선택" className="flex flex-col">
        {options.map((opt, index) => {
          const isLast = index === options.length - 1;
          return (
            <li
              key={opt.value}
              role="option"
              className={`
                px-3.5 py-3 cursor-pointer font-hero-info text-primary-black
                transition-colors hover:bg-gray-100
                ${isLast ? 'rounded-b-[8px]' : ''}
              `}
              onClick={() => handleSelect(opt.value)}
            >
              <div className="flex flex-col gap-0.5">
                <span>{opt.label}</span>
                {opt.subwayLine && (
                  <span className="text-sm font-medium text-gray-400">{opt.subwayLine}</span>
                )}
              </div>
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
