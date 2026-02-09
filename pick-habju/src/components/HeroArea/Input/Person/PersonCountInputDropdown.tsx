'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import GuestCounter from '../../../GuestCounter/GuestCounter';
import Button from '../../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../../Button/ButtonEnums';
import PersonCountInput from './PersonCountInput';

export interface PersonCountInputDropdownProps {
  count: number;
  /** 인원 확정 시 호출. true 반환 시 드롭다운 닫힘, false 시 유지 */
  onConfirm: (count: number) => boolean | void;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const PersonCountInputDropdown = ({
  count,
  onConfirm,
  disabled = false,
  min = 1,
  max = 30,
}: PersonCountInputDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(count);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setGuestCount(count);
      return !prev;
    });
  }, [count]);

  const handleConfirm = useCallback(() => {
    const shouldClose = onConfirm(guestCount);
    if (shouldClose !== false) {
      setIsOpen(false);
    }
  }, [guestCount, onConfirm]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) setGuestCount(count);
  }, [isOpen, count]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleCancel();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleCancel]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-[19.875rem] min-w-[14.375rem] rounded-lg border-2 border-gray-200 overflow-hidden shadow-search"
    >
      <PersonCountInput count={count} onChangeClick={handleToggle} isOpen={isOpen} />

      {isOpen && (
        <div className="flex flex-col bg-primary-white gap-4 py-4 px-3.5 items-center">
          <GuestCounter value={guestCount} onChange={setGuestCount} min={min} max={max} />
          <Button
            label="확인"
            variant={ButtonVariant.Main}
            size={BtnSizeVariant.SM}
            disabled={disabled}
            onClick={handleConfirm}
          />
        </div>
      )}
    </div>
  );
};

export default PersonCountInputDropdown;
