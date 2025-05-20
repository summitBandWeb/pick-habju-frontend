import { useState } from 'react';
import ScrollPicker from '../ScrollPicker/ScrollPicker';
import type { TimePeriod } from '../../../enums/components';
import type { TimePickerBodyProps } from './TimePickerBody.types';

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
  const [h1, setH1] = useState(startHour);
  const [p1, setP1] = useState<TimePeriod>(startPeriod);
  const [h2, setH2] = useState(endHour);
  const [p2, setP2] = useState<TimePeriod>(endPeriod);

  const update = (newH: number, newP: TimePeriod, side: 'start' | 'end') => {
    if (side === 'start') {
      setH1(newH);
      setP1(newP);
      onChange(newH, newP, h2, p2);
    } else {
      setH2(newH);
      setP2(newP);
      onChange(h1, p1, newH, newP);
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center w-84 h-62 bg-primary-white rounded-xl overflow-hidden">
      <div className="absolute left-0 right-0 top-1/2 h-[50px] -translate-y-1/2 bg-gray-200 rounded-lg" />
      <div className="relative flex items-center space-x-2 px-6 py-2 font-modal-timepicker">
        {/* Start */}
        <div className="flex space-x-2 gap-2">
          <ScrollPicker
            list={hours}
            value={h1}
            onChange={(val) => update(val, p1, 'start')}
            itemHeight={50}
            disabled={disabled}
          />
          <ScrollPicker
            list={periods}
            value={p1}
            onChange={(val) => update(h1, val as TimePeriod, 'start')}
            itemHeight={50}
            disabled={disabled}
          />
        </div>
        <span className="text-2xl text-black">~</span>
        {/* End */}
        <div className="flex space-x-2">
          <ScrollPicker
            list={hours}
            value={h2}
            onChange={(val) => update(val, p2, 'end')}
            itemHeight={50}
            disabled={disabled}
          />
          <ScrollPicker
            list={periods}
            value={p2}
            onChange={(val) => update(h2, val as TimePeriod, 'end')}
            itemHeight={50}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
