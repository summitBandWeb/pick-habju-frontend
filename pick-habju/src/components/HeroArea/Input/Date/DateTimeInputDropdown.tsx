'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import DatePicker from '../../../DatePicker/DatePicker';
import PickerFooter from '../../../PickerFooter/PickerFooter';
import { TimePickerBody } from '../../../TimePicker/TimPickerBody/TimePickerBody';
import { TimePeriod } from '../../../TimePicker/TimePickerEnums';
import DateTimeInput from './DateTimeInput';

export interface DateTimeInputDropdownProps {
  dateTime: string;
  initialSelectedDate?: Date;
  /** TimePickerBody 초기값 */
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
  disabled?: boolean;
}

const DateTimeInputDropdown = ({
  dateTime,
  initialSelectedDate,
  initialStartHour = 9,
  initialStartPeriod = TimePeriod.AM,
  initialEndHour = 5,
  initialEndPeriod = TimePeriod.PM,
  onConfirm,
  disabled = false,
}: DateTimeInputDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerState, setPickerState] = useState<{
    step: 'DATE' | 'TIME';
    selectedDates: Date[];
    tempDate: Date | null;
    time: {
      startHour: number;
      startPeriod: TimePeriod;
      endHour: number;
      endPeriod: TimePeriod;
    };
  }>({
    step: 'DATE',
    selectedDates: initialSelectedDate ? [initialSelectedDate] : [new Date()],
    tempDate: null,
    time: {
      startHour: initialStartHour,
      startPeriod: initialStartPeriod,
      endHour: initialEndHour,
      endPeriod: initialEndPeriod,
    },
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        setPickerState((s) => ({ ...s, step: 'DATE' }));
      }
      return !prev;
    });
  }, []);

  const handleDateChange = useCallback((dates: Date[]) => {
    setPickerState((s) => ({ ...s, selectedDates: dates }));
  }, []);

  const handleDateStepConfirm = useCallback(() => {
    setPickerState((s) => {
      const date = s.selectedDates[0];
      if (date) return { ...s, tempDate: date, step: 'TIME' };
      return s;
    });
  }, []);

  const handleDateStepCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleTimeDraftChange = useCallback(
    (sh: number, sp: TimePeriod, eh: number, ep: TimePeriod) => {
      setPickerState((s) => ({
        ...s,
        time: { startHour: sh, startPeriod: sp, endHour: eh, endPeriod: ep },
      }));
    },
    []
  );

  const handleTimeConfirm = useCallback(() => {
    const date = pickerState.tempDate ?? pickerState.selectedDates[0];
    if (!date) return;
    const { startHour, startPeriod, endHour, endPeriod } = pickerState.time;
    const shouldClose = onConfirm(date, startHour, startPeriod, endHour, endPeriod);
    if (shouldClose !== false) {
      setIsOpen(false);
      setPickerState((s) => ({ ...s, step: 'DATE' }));
    }
  }, [pickerState, onConfirm]);

  const handleTimeCancel = useCallback(() => {
    setPickerState((s) => ({ ...s, step: 'DATE' }));
  }, []);

  // initialSelectedDate가 바뀌면 selectedDates 동기화
  useEffect(() => {
    if (initialSelectedDate) {
      setPickerState((s) => ({ ...s, selectedDates: [initialSelectedDate] }));
    }
  }, [initialSelectedDate]);

  // 부모의 initial 값이 바뀌면 time 동기화 (확정 후 스토어 업데이트 시에만 변경됨)
  useEffect(() => {
    setPickerState((s) => ({
      ...s,
      time: {
        startHour: initialStartHour,
        startPeriod: initialStartPeriod,
        endHour: initialEndHour,
        endPeriod: initialEndPeriod,
      },
    }));
  }, [initialStartHour, initialStartPeriod, initialEndHour, initialEndPeriod]);

  // 바깥 클릭 + ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleDateStepCancel();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (pickerState.step === 'TIME') {
          setPickerState((s) => ({ ...s, step: 'DATE' }));
        } else {
          handleDateStepCancel();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, pickerState.step, handleDateStepCancel]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col w-[19.875rem] min-w-[14.375rem] rounded-lg border-2 border-gray-200 overflow-hidden shadow-search`}
    >
      <DateTimeInput dateTime={dateTime} onChangeClick={handleToggle} isOpen={isOpen} />

      {isOpen && (
        <div className="flex flex-col bg-primary-white">
          {pickerState.step === 'DATE' ? (
            <>
              <DatePicker
                initialSelectedDate={pickerState.selectedDates[0] ?? initialSelectedDate}
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
              <TimePickerBody
                startHour={pickerState.time.startHour}
                startPeriod={pickerState.time.startPeriod}
                endHour={pickerState.time.endHour}
                endPeriod={pickerState.time.endPeriod}
                onChange={handleTimeDraftChange}
                disabled={disabled}
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
