import type { TimePeriod } from './TimePickerEnums';

export interface TimePickerProps {
  initialStartHour?: number;
  initialStartPeriod?: TimePeriod;
  initialEndHour?: number;
  initialEndPeriod?: TimePeriod;
  onConfirm: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onCancel: () => void;
  disabled?: boolean;
}
