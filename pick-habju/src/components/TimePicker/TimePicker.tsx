import { useState } from 'react';
import type { TimePickerProps } from './TimePicker.types';
import { TimePickerBody } from './TimPickerBody/TimePickerBody';
import { TimePeriod } from './TimePickerEnums';

/**
 * TimePicker.tsx
 *
 * 시간 선택기 컴포넌트 (TimePickerBody)
 * 선택된 시간은 onDraftChange로 외부에 전달됩니다.
 * 푸터(확인/이전)는 상위 컴포넌트에서 렌더링합니다.
 */
const TimePicker = ({
  initialStartHour = 9,
  initialStartPeriod = TimePeriod.AM,
  initialEndHour = 5,
  initialEndPeriod = TimePeriod.PM,
  disabled = false,
  onDraftChange,
}: TimePickerProps) => {
  const [time, setTime] = useState({
    startHour: initialStartHour,
    startPeriod: initialStartPeriod,
    endHour: initialEndHour,
    endPeriod: initialEndPeriod,
  });

  const handleChange = (
    newStartHour: number,
    newStartPeriod: TimePeriod,
    newEndHour: number,
    newEndPeriod: TimePeriod
  ) => {
    setTime({
      startHour: newStartHour,
      startPeriod: newStartPeriod,
      endHour: newEndHour,
      endPeriod: newEndPeriod,
    });
    onDraftChange?.(newStartHour, newStartPeriod, newEndHour, newEndPeriod);
  };

  return (
    <div className="flex w-90 bg-white rounded-xl overflow-hidden px-2 pt-15 flex-col gap-15">
      <TimePickerBody
        startHour={time.startHour}
        startPeriod={time.startPeriod}
        endHour={time.endHour}
        endPeriod={time.endPeriod}
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};

export default TimePicker;
