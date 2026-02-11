'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import LocationIcon from '../../../../assets/svg/location.svg';

export interface LocationOption {
  id: string;
  name: string;
  /** 역에 연결된 노선 정보 (예: "4호선·7호선"). */
  subwayLine: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

/** 노선 식별자: 숫자(1~9) 또는 문자(A=공항철도, K=경의중앙선) */
type SubwayLineId = number | 'A' | 'K';

/** "4호선·7호선·공항철도·경의중앙선" 형태의 문자열에서 노선 배열 추출 (순서 유지) */
function parseSubwayLines(subwayLine: string): SubwayLineId[] {
  const parts = subwayLine.split(/[·\s]+/).filter(Boolean);
  return parts
    .map((part): SubwayLineId | null => {
      const numMatch = part.match(/\d+/);
      if (numMatch) return Number(numMatch[0]);
      if (part.includes('공항철도')) return 'A';
      if (part.includes('경의중앙선')) return 'K';
      return null;
    })
    .filter((v): v is SubwayLineId => v !== null);
}

const SUBWAY_LINE_BG_CLASSES: Record<SubwayLineId, string> = {
  1: 'bg-subway-line-1',
  2: 'bg-subway-line-2',
  3: 'bg-subway-line-3',
  4: 'bg-subway-line-4',
  5: 'bg-subway-line-5',
  6: 'bg-subway-line-6',
  7: 'bg-subway-line-7',
  8: 'bg-subway-line-8',
  9: 'bg-subway-line-9',
  A: 'bg-subway-line-a',
  K: 'bg-subway-line-k',
};

export interface LocationInputDropdownProps {
  /** 현재 선택된 지역 표시 텍스트 */
  location: string;
  /** 지역 옵션 목록 */
  options: LocationOption[];
  /** 지역 선택 시 호출. 선택된 LocationOption 객체 전달. true 반환 시 드롭다운 닫힘 */
  onSelect: (location: LocationOption) => boolean | void;
  /** 드롭다운 열림 상태 (부모에서 제어) */
  isOpen: boolean;
  /** 드롭다운 열림/닫힘 요청 */
  onOpenChange: (open: boolean) => void;
}

const LocationInputDropdown = ({
  location,
  options,
  onSelect,
  isOpen,
  onOpenChange,
}: LocationInputDropdownProps) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    onOpenChange(!isOpen);
  }, [isOpen, onOpenChange]);

  const handleSelect = useCallback(
    (location: LocationOption) => {
      const shouldClose = onSelect(location);
      if (shouldClose !== false) {
        onOpenChange(false);
      }
    },
    [onSelect, onOpenChange]
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

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

  useEffect(() => {
    if (isOpen && options.length > 0) {
      const idx = options.findIndex((opt) => opt.name === location);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [isOpen, options, location]);

  // --- Input 영역 렌더 (DateTimeInput과 동일 스타일) ---
  const renderInputArea = () => {
    const handleInputKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      //화살표 키 네비게이션. 드롭다운이 열린 상태에서 화살표 키로 이동 하고 enter 키로 선택.
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            handleSelect(options[highlightedIndex]);
          }
          return;
        }
      }
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
          const isSelected = location === opt.name;
          const isHighlighted = index === highlightedIndex;
          const lineIds = opt.subwayLine ? parseSubwayLines(opt.subwayLine) : [];
          return (
            <li
              key={opt.id}
              role="option"
              aria-selected={isSelected}
              className={`
                group min-h-[48px] px-10.5 py-4 cursor-pointer
                flex items-center gap-2.5
                border-t border-b border-gray-200
                transition-colors duration-150
                hover:bg-gray-200
                active:bg-gray-200
                ${isHighlighted ? 'bg-gray-200' : 'bg-primary-white'}
                ${isLast ? 'rounded-b-[8px] border-b-0' : ''}
              `}
              onClick={() => handleSelect(opt)}
            >
              <span
                className={`
                  font-modal-default text-gray-500
                  transition-all duration-150
                  group-hover:!text-[17px]
                  group-active:text-primary-black group-active:!text-[17px]
                `}
              >
                {opt.name}
              </span>
              {lineIds.length > 0 && (
                <div className="flex items-center gap-1">
                  {lineIds.map((id, idx) => (
                    <span
                      key={`${id}-${idx}`}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[12px] font-bold leading-none text-white ${SUBWAY_LINE_BG_CLASSES[id] ?? 'bg-gray-400'}`}
                    >
                      {id}
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
