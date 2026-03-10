const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;
const parseHour = (s: string) => parseInt(s.split(':')[0], 10) || 0;

/**
 * Date 객체에서 한국어 요일 문자열을 반환.
 * @param date 요일을 추출할 Date 객체
 * @returns '일' | '월' | '화' | '수' | '목' | '금' | '토'
 */
export function getKoreanWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

/**
 * ISO 날짜 문자열을 한국어 날짜 + 요일 형식으로 포맷.
 * 파싱 실패 시 입력값 그대로 반환.
 * @param dateIso 'YYYY-MM-DD' 형식 날짜 문자열
 * @returns 예: '2026년 2월 26일 (목)'
 */
export function formatDateKoreanWithWeekday(dateIso: string): string {
  const [y, m, d] = dateIso.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d) return dateIso;
  const dt = new Date(y, m - 1, d);
  return `${dt.getFullYear()}년 ${m}월 ${d}일 (${WEEKDAYS[dt.getDay()]})`;
}

/** date("YYYY-MM-DD")와 hour_slots(["14:00","15:00"])를 받아 검색 조건 요약 문자열로 변환. 예: "02/26 14-17시". 빈 배열이면 빈 문자열. */
export function formatSearchConditionDateTime(date: string, hourSlots: string[]): string {
  if (!hourSlots || hourSlots.length === 0) return '';
  const [, month, day] = date.split('-');
  const startHour = parseHour(hourSlots[0]);
  const lastHour = parseHour(hourSlots[hourSlots.length - 1]);
  const endHour = (lastHour + 1) % 24 === 0 ? 24 : (lastHour + 1) % 24;
  const startStr = String(startHour).padStart(2, '0');
  const endStr = String(endHour).padStart(2, '0');
  return `${month}/${day} ${startStr}-${endStr}시`;
}

/**
 * hour_slots 배열의 첫 슬롯(시작)과 마지막 슬롯(종료 +1h)으로 시간 범위 문자열을 반환.
 * @param hourSlots 'HH:MM' 또는 'HH' 형식의 시간 슬롯 배열 (예: ['14:00', '15:00', '16:00'])
 * @returns 예: '14시-17시'. 빈 배열이면 빈 문자열.
 */
export function formatTimeRangeFromSlots(hourSlots: string[]): string {
  if (!hourSlots || hourSlots.length === 0) return '';
  const start = parseHour(hourSlots[0]);
  const last = parseHour(hourSlots[hourSlots.length - 1]);
  const end = (last + 1) % 24;
  const endDisplay = end === 0 ? 24 : end;
  return `${start}시-${endDisplay}시`;
}
