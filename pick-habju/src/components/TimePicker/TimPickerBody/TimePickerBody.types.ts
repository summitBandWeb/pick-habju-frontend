import type { TimePeriod } from '../TimePickerEnums';

export interface TimePickerBodyProps {
  startHour: number;
  startPeriod: TimePeriod;
  endHour: number;
  endPeriod: TimePeriod;
  onChange: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  disabled?: boolean;
}
