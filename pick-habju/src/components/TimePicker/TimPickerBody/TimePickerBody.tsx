import ScrollPicker from '../ScrollPicker/ScrollPicker';
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
  return (
    <div className="relative inline-flex items-center justify-center w-84 h-62 bg-primary-white rounded-xl overflow-hidden">
      <div className="absolute left-0 right-0 top-1/2 h-[50px] -translate-y-1/2 bg-gray-200 rounded-lg" />
      <div className="relative flex items-center space-x-[0.375rem] px-6 py-2 font-modal-timepicker">
        {/* Start */}
        <div className="flex items-center space-x-1">
          <div className="w-[1.8ch] flex justify-center">
            <ScrollPicker
              list={hours}
              value={startHour}
              onChange={(newStartHour) => onChange(newStartHour, startPeriod, endHour, endPeriod)}
              itemHeight={50}
              disabled={disabled}
            />
          </div>
          <div className="w-[2.6ch] flex justify-center">
            <ScrollPicker
              list={periods}
              value={startPeriod}
              onChange={(newStartPeriod) => onChange(startHour, newStartPeriod as TimePeriod, endHour, endPeriod)}
              itemHeight={50}
              disabled={disabled}
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
              itemHeight={50}
              disabled={disabled}
            />
          </div>
          <div className="w-[2.6ch] flex justify-center">
            <ScrollPicker
              list={periods}
              value={endPeriod}
              onChange={(newEndPeriod) => onChange(startHour, startPeriod, endHour, newEndPeriod as TimePeriod)}
              itemHeight={50}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
