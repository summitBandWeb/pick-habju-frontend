import { TimePeriod } from '../components/TimePicker/TimePickerEnums';

export const convertTo24Hour = (hour: number, period: TimePeriod): number => {
  if (period === TimePeriod.PM && hour !== 12) {
    return hour + 12;
  }
  if (period === TimePeriod.AM && hour === 12) {
    return 0;
  }
  return hour;
};

export const formatDate = (date: Date | null): string => {
  if (!date) return '날짜를 선택해 주세요.';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
