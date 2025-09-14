import { parseISO, format, addHours } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 선택된 시간 슬롯들의 시작과 끝을 기준으로 예약 레이블을 생성합니다.
 * (예: ['14:00', '17:00'] 선택 시 "14~18시"로 표시)
 * @param dateIso - 'YYYY-MM-DD' 형식의 날짜 문자열
 * @param hourSlots - ['HH:00', ...] 형식의 시간 슬롯 배열
 * @returns 포맷팅된 예약 시간 레이블 문자열
 */
export const formatReservationLabel = (dateIso: string, hourSlots: string[]): string => {
  if (!dateIso || hourSlots.length === 0) {
    return '';
  }

  const dateObj = parseISO(dateIso);
  const datePart = format(dateObj, 'M월 d일 (E)', { locale: ko });

  // 시작 시간 계산 (가장 빠른 슬롯)
  const firstSlot = hourSlots[0];
  const startTime = parseISO(`${dateIso}T${firstSlot}`);

  // 종료 시간 계산 (가장 늦은 슬롯 + 1시간)
  const lastSlot = hourSlots[hourSlots.length - 1];
  const endTime = addHours(parseISO(`${dateIso}T${lastSlot}`), 1);

  const timePart = `${format(startTime, 'HH')}~${format(endTime, 'HH')}시`;

  return `${datePart} ${timePart}`;
};
