import type { TimePeriod } from './TimePickerEnums';
import type { TimePickerBodyProps } from './TimPickerBody/TimePickerBody.types';

export interface TimePickerProps extends Omit<TimePickerBodyProps, 'onChange'> {
  onConfirm: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onCancel: () => void;
  disabled?: boolean;
}
