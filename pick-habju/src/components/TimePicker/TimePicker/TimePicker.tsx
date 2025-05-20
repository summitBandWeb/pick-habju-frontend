// src/components/TimePicker/TimePicker.tsx
import { useEffect, useState } from 'react';

import type { TimePeriod } from '../../../enums/components';
import { TimePickerBody, type TimePickerBodyProps } from '../TimPickerBody/TimePickerBody';
import DatePickerFooter from '../../DatePicker/Footer/DatePickerFooter';

interface TimePickerProps extends Omit<TimePickerBodyProps, 'onChange'> {
  onConfirm: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onCancel: () => void;
  disabled?: boolean;
}

const TimePicker = ({
  startHour,
  startPeriod,
  endHour,
  endPeriod,
  onConfirm,
  onCancel,
  disabled = false,
}: TimePickerProps) => {
  const [sh, setSH] = useState(startHour);
  const [sp, setSP] = useState<TimePeriod>(startPeriod);
  const [eh, setEH] = useState(endHour);
  const [ep, setEP] = useState<TimePeriod>(endPeriod);

  useEffect(() => {
    setSH(startHour);
  }, [startHour]);

  useEffect(() => {
    setSP(startPeriod);
  }, [startPeriod]);

  useEffect(() => {
    setEH(endHour);
  }, [endHour]);

  useEffect(() => {
    setEP(endPeriod);
  }, [endPeriod]);

  const handleChange = (
    newStartHour: number,
    newStartPeriod: TimePeriod,
    newEndHour: number,
    newEndPeriod: TimePeriod
  ) => {
    setSH(newStartHour);
    setSP(newStartPeriod);
    setEH(newEndHour);
    setEP(newEndPeriod);
  };

  const handleConfirm = () => {
    onConfirm(sh, sp, eh, ep);
  };

  return (
    <div className="flex w-90 bg-white rounded-xl shadow-lg overflow-hidden px-2 pt-15 flex-col gap-15">
      <TimePickerBody
        startHour={sh}
        startPeriod={sp}
        endHour={eh}
        endPeriod={ep}
        onChange={handleChange}
        disabled={disabled}
      />
      <DatePickerFooter onConfirm={handleConfirm} onCancel={onCancel} disabled={disabled} />
    </div>
  );
};

export default TimePicker;
