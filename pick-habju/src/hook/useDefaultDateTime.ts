import { addHours, startOfHour, format } from 'date-fns';
import { formatReservationLabel } from '../utils/formatReservationLabel';

export interface DefaultDateTime {
  defaultDateIso: string;
  defaultSlots: string[];
  defaultDateTimeLabel: string;
  defaultPeopleCount: number;
}

/**
 * 앱의 기본 날짜/시간 값을 계산하는 커스텀 훅입니다.
 * 현재 시간 기준, 다음 정시부터 시작하는 2시간짜리 예약을 기본값으로 합니다.
 * (예: 현재 17:30 -> 시작 시간 18:00, 종료 시간 20:00)
 */

export const useDefaultDateTime = (): DefaultDateTime => {
  // 기본 시간 계산
  const now = new Date();
  // 현재 시간에서 1시간을 더하고, 그 시간의 '정시'로 설정 (예: 17:30 -> 18:30 -> 18:00)
  // 경계 케이스(자정, 월말, 연말 등)는 date-fns의 startOfHour와 addHours 함수가 올바르게 처리합니다.
  const startTime = startOfHour(addHours(now, 1));

  // 기본값 생성
  const defaultDateIso = format(startTime, 'yyyy-MM-dd');
  const defaultSlots = [
    format(startTime, 'HH:00'),
    format(addHours(startTime, 1), 'HH:00'), // 시작 시간에서 1시간 뒤
  ];

  // 포맷팅 함수를 재사용하여 레이블 생성 (중복 제거)
  const defaultDateTimeLabel = formatReservationLabel(defaultDateIso, defaultSlots);

  const defaultPeopleCount = 12;

  return {
    defaultDateIso,
    defaultSlots,
    defaultDateTimeLabel,
    defaultPeopleCount,
  };
};
