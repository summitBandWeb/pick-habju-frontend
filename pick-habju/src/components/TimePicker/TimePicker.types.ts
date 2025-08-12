import type { TimePeriod } from './TimePickerEnums';

export interface TimePickerProps {
  initialStartHour?: number;
  initialStartPeriod?: TimePeriod;
  initialEndHour?: number;
  initialEndPeriod?: TimePeriod;
  onConfirm: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onCancel: () => void;
  disabled?: boolean;
  // 사용자가 선택 중인 값을 부모에서 임시 저장할 수 있도록 제공
  onDraftChange?: (
    startHour: number,
    startPeriod: TimePeriod,
    endHour: number,
    endPeriod: TimePeriod
  ) => void;
}
