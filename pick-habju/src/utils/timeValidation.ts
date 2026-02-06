import { TimePeriod } from '../components/TimePicker/TimePickerEnums';
import { convertTo24Hour } from './formatDate';
import { ReservationToastKey } from '../components/ToastMessage/ToastMessageEnums';

export function validateReservationTime(
  date: Date | null,
  startHour: number,
  startPeriod: TimePeriod,
  endHour: number,
  endPeriod: TimePeriod
): ReservationToastKey | null {
  const start24 = convertTo24Hour(startHour, startPeriod);
  const end24 = convertTo24Hour(endHour, endPeriod);

  const adjustedEnd = end24 <= start24 ? end24 + 24 : end24;
  const duration = adjustedEnd - start24;

  const candidates: ReservationToastKey[] = [];

  if (start24 === end24 && startPeriod === endPeriod) {
    candidates.push(ReservationToastKey.INVALID_TYPE);
  }
  if (duration > 5) {
    candidates.push(ReservationToastKey.TOO_LONG);
  }
  if (duration === 1) {
    candidates.push(ReservationToastKey.TOO_SHORT);
  }
  if (date) {
    const now = new Date();
    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    if (isSameDay) {
      const selectedDateTime = new Date(date);
      selectedDateTime.setHours(start24, 0, 0, 0);
      if (now.getTime() > selectedDateTime.getTime()) {
        return ReservationToastKey.PAST_TIME;
      }
    }
  }

  if (candidates.length === 0) return null;

  const errorPriority: ReservationToastKey[] = [
    ReservationToastKey.INVALID_TYPE,
    ReservationToastKey.PAST_TIME,
    ReservationToastKey.TOO_LONG,
  ];
  const warningPriority: ReservationToastKey[] = [ReservationToastKey.TOO_SHORT];
  const error = errorPriority.find((k) => candidates.includes(k));
  if (error) return error;
  const warning = warningPriority.find((k) => candidates.includes(k));
  return warning ?? null;
}
