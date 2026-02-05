import { useState } from 'react';
import ScrollPicker from '../ScrollPicker/ScrollPicker';
import { TimePickerInlineInput } from '../TimePickerInlineInput/TimePickerInlineInput';
import type { TimePickerBodyProps } from './TimePickerBody.types';
import type { TimePeriod } from '../TimePickerEnums';

const hours = Array.from({ length: 12 }, (_, i) => (i + 1) as number);
const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

export const TimePickerBody = ({
  startHour,
  startPeriod,
  endHour,
  endPeriod,
  onChange,
  disabled = false,
}: TimePickerBodyProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleNumberAreaClick = () => {
    if (disabled) return;
    setIsEditMode(true);
  };

  const handleInlineInputBlur = () => {
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <div className="relative inline-flex items-center justify-center w-[19.875rem] h-[15.5rem] bg-primary-white overflow-hidden">
        <div className="relative flex items-center justify-center px-6 py-2 font-modal-timepicker">
          <TimePickerInlineInput
            startHour={startHour}
            startPeriod={startPeriod}
            endHour={endHour}
            endPeriod={endPeriod}
            onChange={onChange}
            onBlur={handleInlineInputBlur}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center w-[19.875rem] h-[15.5rem] bg-primary-white overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[16.75rem] h-[2.75rem] rounded-lg bg-primary-white shadow-filter" />
      <div className="relative flex items-center space-x-[0.375rem] px-6 py-2 font-modal-timepicker">
        {/* Start */}
        <div className="flex items-center space-x-1">
          <div className="w-[1.8ch] flex justify-center">
            <ScrollPicker
              list={hours}
              value={startHour}
              onChange={(newStartHour) => onChange(newStartHour, startPeriod, endHour, endPeriod)}
              itemHeight={44}
              disabled={disabled}
              onSelectedItemClick={handleNumberAreaClick}
            />
          </div>
          <div className="w-[2.6ch] flex justify-center">
            <ScrollPicker
              list={periods}
              value={startPeriod}
              onChange={(newStartPeriod) => onChange(startHour, newStartPeriod as TimePeriod, endHour, endPeriod)}
              itemHeight={44}
              disabled={disabled}
              onSelectedItemClick={handleNumberAreaClick}
            />
          </div>
        </div>
        <span className="text-2xl text-black w-[1.4ch] text-center">~</span>
        {/* End */}
        <div className="flex items-center space-x-1">
          <div className="w-[1.8ch] flex justify-center">
            <ScrollPicker
              list={hours}
              value={endHour}
              onChange={(newEndHour) => onChange(startHour, startPeriod, newEndHour, endPeriod)}
              itemHeight={44}
              disabled={disabled}
              onSelectedItemClick={handleNumberAreaClick}
            />
          </div>
          <div className="w-[2.6ch] flex justify-center">
            <ScrollPicker
              list={periods}
              value={endPeriod}
              onChange={(newEndPeriod) => onChange(startHour, startPeriod, endHour, newEndPeriod as TimePeriod)}
              itemHeight={44}
              disabled={disabled}
              onSelectedItemClick={handleNumberAreaClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
