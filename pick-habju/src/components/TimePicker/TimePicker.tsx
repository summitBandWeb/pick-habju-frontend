import { useState } from 'react';
import PickerFooter from '../PickerFooter/PickerFooter';
import type { TimePickerProps } from './TimePicker.types';
import { TimePickerBody } from './TimPickerBody/TimePickerBody';
import { TimePeriod } from './TimePickerEnums';

const TimePicker = ({
  initialStartHour = 9,
  initialStartPeriod = TimePeriod.AM,
  initialEndHour = 5,
  initialEndPeriod = TimePeriod.PM,
  onConfirm,
  onCancel,
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

  const handleConfirm = () => {
    const { startHour, startPeriod, endHour, endPeriod } = time;
    onConfirm(startHour, startPeriod, endHour, endPeriod);
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
      <PickerFooter onConfirm={handleConfirm} onCancel={onCancel} disabled={disabled} cancelText="뒤로가기" />
    </div>
  );
};

export default TimePicker;
