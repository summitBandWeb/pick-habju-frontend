import type { TimePeriod } from '../../../enums/components';

export interface TimePickerBodyProps {
  startHour: number;
  startPeriod: TimePeriod;
  endHour: number;
  endPeriod: TimePeriod;
  onChange: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  disabled?: boolean;
}
