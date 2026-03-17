import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import DatePicker from '../../../DatePicker/DatePicker';
import PickerFooter from '../../../PickerFooter/PickerFooter';
import { TimePickerBody } from '../../../TimePicker/TimPickerBody/TimePickerBody';
import { TimePeriod } from '../../../TimePicker/TimePickerEnums';
import { getReservationDurationHours } from '../../../../utils/timeDuration';
import DateTimeInput from './DateTimeInput';
import TimePickerBodyTimeInfo from './TimePickerBodyTimeInfo';

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
  /** 드롭다운 열림 상태 (부모에서 제어) */
  isOpen: boolean;
  /** 드롭다운 열림/닫힘 요청 */
  onOpenChange: (open: boolean) => void;
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
  isOpen,
  onOpenChange,
}: DateTimeInputDropdownProps) => {
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
    if (!isOpen) {
      setPickerState((s) => ({ ...s, step: 'DATE' }));
    }
    onOpenChange(!isOpen);
  }, [isOpen, onOpenChange]);

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
    onOpenChange(false);
  }, [onOpenChange]);

  const handleTimeDraftChange = useCallback((sh: number, sp: TimePeriod, eh: number, ep: TimePeriod) => {
    setPickerState((s) => ({
      ...s,
      time: { startHour: sh, startPeriod: sp, endHour: eh, endPeriod: ep },
    }));
  }, []);

  const handleTimeConfirm = useCallback(() => {
    const date = pickerState.tempDate ?? pickerState.selectedDates[0];
    if (!date) return;
    const { startHour, startPeriod, endHour, endPeriod } = pickerState.time;
    const shouldClose = onConfirm(date, startHour, startPeriod, endHour, endPeriod);
    if (shouldClose !== false) {
      onOpenChange(false);
      setPickerState((s) => ({ ...s, step: 'DATE' }));
    }
  }, [pickerState, onConfirm, onOpenChange]);

  const handleTimeCancel = useCallback(() => {
    setPickerState((s) => ({ ...s, step: 'DATE' }));
  }, []);

  const selectedDurationHours = getReservationDurationHours(
    pickerState.time.startHour,
    pickerState.time.startPeriod,
    pickerState.time.endHour,
    pickerState.time.endPeriod
  );

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

  // 선택된 날짜가 오늘인지 확인
  const isToday = () => {
    const selected = pickerState.selectedDates[0];
    if (!selected) return false;
    const today = new Date();
    return (
      selected.getFullYear() === today.getFullYear() &&
      selected.getMonth() === today.getMonth() &&
      selected.getDate() === today.getDate()
    );
  };

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

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="date-time-dropdown"
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 1, y: 0, height: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="origin-top"
          >
            <div className="flex flex-col bg-primary-white">
              {pickerState.step === 'DATE' ? (
                <>
                  <DatePicker
                    initialSelectedDate={pickerState.selectedDates[0] ?? initialSelectedDate}
                    onChange={handleDateChange}
                  />
                  {isToday() && (
                    <div className="px-[23.5px] py-1.5">
                      <p className="font-modal-calcdetail text-gray-300">
                        당일 예약은 취소 시 전액 위약금이 발생합니다. 신중히 선택해주세요!
                      </p>
                    </div>
                  )}
                  <PickerFooter onConfirm={handleDateStepConfirm} onCancel={handleDateStepCancel} confirmText="다음" />
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
                  <TimePickerBodyTimeInfo selectedDurationHours={selectedDurationHours} />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateTimeInputDropdown;
