import { useEffect, useState } from 'react';
import PickerFooter from '../PickerFooter/PickerFooter';
import type { TimePickerProps } from './TimePicker.types';
import { TimePickerBody } from './TimPickerBody/TimePickerBody';
import type { TimePeriod } from './TimePickerEnums';

const TimePicker = ({
  startHour,
  startPeriod,
  endHour,
  endPeriod,
  onConfirm,
  onCancel,
  disabled = false,
}: TimePickerProps) => {
  const [time, setTime] = useState({
    startHour,
    startPeriod,
    endHour,
    endPeriod,
  });
  // prop이 바뀔 때 state 동기화
  useEffect(() => {
    setTime({ startHour, startPeriod, endHour, endPeriod });
  }, [startHour, startPeriod, endHour, endPeriod]);
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
  };
  const handleConfirm = () => {
    const { startHour, startPeriod, endHour, endPeriod } = time;
    onConfirm(startHour, startPeriod, endHour, endPeriod);
  };

  return (
    <div className="flex w-90 bg-white rounded-xl shadow-lg overflow-hidden px-2 pt-15 flex-col gap-15">
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
