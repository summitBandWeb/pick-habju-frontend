import type { TimePeriod } from '../../enums/components';
import type { TimePickerBodyProps } from './TimPickerBody/TimePicker.types';

export interface TimePickerProps extends Omit<TimePickerBodyProps, 'onChange'> {
  onConfirm: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onCancel: () => void;
  disabled?: boolean;
}
