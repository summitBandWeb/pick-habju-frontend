'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import DatePicker from '../../../DatePicker/DatePicker';
import PickerFooter from '../../../PickerFooter/PickerFooter';
import TimePicker from '../../../TimePicker/TimePicker';
import { TimePeriod } from '../../../TimePicker/TimePickerEnums';
import DateTimeInput from './DateTimeInput';

export interface DateTimeInputDropdownProps {
  dateTime: string;
  initialSelectedDate?: Date;
  /** TimePicker 초기값 */
  initialStartHour?: number;
  initialStartPeriod?: TimePeriod;
  initialEndHour?: number;
  initialEndPeriod?: TimePeriod;
  /** 날짜+시간 확정 시 호출. true 반환 시 드롭다운 닫힘, false 시 유지(검증 실패 등) */
  onConfirm: (
    date: Date,
    startHour: number,
    startPeriod: TimePeriod,
    endHour: number,
    endPeriod: TimePeriod
  ) => boolean | void;
  onClose?: () => void;
  disabled?: boolean;
  onDraftChange?: (
    startHour: number,
    startPeriod: TimePeriod,
    endHour: number,
    endPeriod: TimePeriod
  ) => void;
}

const DateTimeInputDropdown = ({
  dateTime,
  initialSelectedDate,
  initialStartHour = 9,
  initialStartPeriod = TimePeriod.AM,
  initialEndHour = 5,
  initialEndPeriod = TimePeriod.PM,
  onConfirm,
  onClose,
  disabled = false,
  onDraftChange,
}: DateTimeInputDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'DATE' | 'TIME'>('DATE');
  const [selectedDates, setSelectedDates] = useState<Date[]>(() =>
    initialSelectedDate ? [initialSelectedDate] : [new Date()]
  );
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [draftTime, setDraftTime] = useState({
    startHour: initialStartHour,
    startPeriod: initialStartPeriod,
    endHour: initialEndHour,
    endPeriod: initialEndPeriod,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setStep('DATE');
      return !prev;
    });
  }, []);

  const handleDateChange = useCallback((dates: Date[]) => {
    setSelectedDates(dates);
  }, []);

  const handleDateStepConfirm = useCallback(() => {
    const date = selectedDates[0];
    if (date) {
      setTempDate(date);
      setStep('TIME');
    }
  }, [selectedDates]);

  const handleDateStepCancel = useCallback(() => {
    onClose?.();
    setIsOpen(false);
  }, [onClose]);

  const handleTimeDraftChange = useCallback(
    (sh: number, sp: TimePeriod, eh: number, ep: TimePeriod) => {
      setDraftTime({ startHour: sh, startPeriod: sp, endHour: eh, endPeriod: ep });
      onDraftChange?.(sh, sp, eh, ep);
    },
    [onDraftChange]
  );

  const handleTimeConfirm = useCallback(() => {
    const date = tempDate ?? selectedDates[0];
    if (!date) return;
    const { startHour, startPeriod, endHour, endPeriod } = draftTime;
    const shouldClose = onConfirm(date, startHour, startPeriod, endHour, endPeriod);
    if (shouldClose !== false) {
      setIsOpen(false);
      setStep('DATE');
    }
  }, [tempDate, selectedDates, draftTime, onConfirm]);

  const handleTimeCancel = useCallback(() => {
    setStep('DATE');
  }, []);

  // initialSelectedDate가 바뀌면 selectedDates 동기화
  useEffect(() => {
    if (initialSelectedDate) {
      setSelectedDates([initialSelectedDate]);
    }
  }, [initialSelectedDate]);

  // TIME 단계 진입 시 draftTime 초기화
  useEffect(() => {
    if (step === 'TIME') {
      setDraftTime({
        startHour: initialStartHour,
        startPeriod: initialStartPeriod,
        endHour: initialEndHour,
        endPeriod: initialEndPeriod,
      });
    }
  }, [step, initialStartHour, initialStartPeriod, initialEndHour, initialEndPeriod]);

  // 바깥 클릭으로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleDateStepCancel();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, handleDateStepCancel]);

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (step === 'TIME') {
          setStep('DATE');
        } else {
          handleDateStepCancel();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step, handleDateStepCancel]);

  return (
    <div ref={containerRef} className="relative">
      <DateTimeInput dateTime={dateTime} onChangeClick={handleToggle} />

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 flex flex-col bg-primary-white shadow-lg">
          {step === 'DATE' ? (
            <>
              <DatePicker
                initialSelectedDate={selectedDates[0] ?? initialSelectedDate}
                onChange={handleDateChange}
              />
              <PickerFooter
                onConfirm={handleDateStepConfirm}
                onCancel={handleDateStepCancel}
                confirmText="다음"
              />
            </>
          ) : (
            <>
              <TimePicker
                initialStartHour={initialStartHour}
                initialStartPeriod={initialStartPeriod}
                initialEndHour={initialEndHour}
                initialEndPeriod={initialEndPeriod}
                disabled={disabled}
                onDraftChange={handleTimeDraftChange}
              />
              <PickerFooter
                onConfirm={handleTimeConfirm}
                onCancel={handleTimeCancel}
                disabled={disabled}
                confirmText="확인"
                cancelText="이전"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeInputDropdown;
