import type { TimePeriod } from '../components/TimePicker/TimePickerEnums';
import { convertTo24Hour } from './formatDate';

export const getReservationDurationHours = (
  startHour: number,
  startPeriod: TimePeriod,
  endHour: number,
  endPeriod: TimePeriod
): number => {
  const start24 = convertTo24Hour(startHour, startPeriod);
  const end24 = convertTo24Hour(endHour, endPeriod);
  if (end24 === start24) {
    return 0;
  }
  const adjustedEnd = end24 < start24 ? end24 + 24 : end24;
  return adjustedEnd - start24;
};
