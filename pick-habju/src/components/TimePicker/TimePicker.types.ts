import type { TimePeriod } from './TimePickerEnums';

export interface TimePickerProps {
  initialStartHour?: number;
  initialStartPeriod?: TimePeriod;
  initialEndHour?: number;
  initialEndPeriod?: TimePeriod;
  disabled?: boolean;
  /** 사용자가 선택 중인 값을 부모에서 임시 저장. 푸터(확인/이전)는 상위 컴포넌트에서 렌더링 */
  onDraftChange?: (
    startHour: number,
    startPeriod: TimePeriod,
    endHour: number,
    endPeriod: TimePeriod
  ) => void;
}
