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

/** props 값을 24h 시간으로 변환하고 2자리 24h 문자열로 (00-23). rawDigits 초기값 설정 시 사용 */
export const to2Digit24h = (hour: number, period: TimePeriod): string => {
  const h = convertTo24Hour(hour, period);
  return h.toString().padStart(2, '0');
};

/** 24h(0-23) → 12h hour(1-12) + period (convertTo24Hour의 역함수) */
export const to12h = (h24: number): { hour: number; period: TimePeriod } => {
  if (h24 === 0) return { hour: 12, period: TimePeriod.AM };
  if (h24 < 12) return { hour: h24, period: TimePeriod.AM };
  if (h24 === 12) return { hour: 12, period: TimePeriod.PM };
  return { hour: h24 - 12, period: TimePeriod.PM };
};

export const formatDate = (date: Date | null): string => {
  if (!date) return '날짜를 선택해 주세요.';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
