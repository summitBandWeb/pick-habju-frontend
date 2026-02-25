const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function getKoreanWeekday(date: Date): string {
  return WEEKDAYS[date.getDay()];
}

export function formatDateKoreanWithWeekday(dateIso: string): string {
  const [y, m, d] = dateIso.split('-').map((x) => parseInt(x, 10));
  if (!y || !m || !d) return dateIso;
  const dt = new Date(y, m - 1, d);
  return `${dt.getFullYear()}년 ${m}월 ${d}일 (${WEEKDAYS[dt.getDay()]})`;
}

/** date("YYYY-MM-DD")와 hour_slots(["14","15"])를 받아 검색 조건 요약 문자열로 변환. 예: "02/26 14-17시" */
export function formatSearchConditionDateTime(date: string, hourSlots: string[]): string {
  const [, month, day] = date.split('-');
  const slots = hourSlots.map((s) => parseInt(s.split(':')[0], 10) || 0);
  const startHour = Math.min(...slots);
  const endHour = Math.max(...slots) + 1;
  return `${month}/${day} ${startHour}-${endHour}시`;
}

export function formatTimeRangeFromSlots(hourSlots: string[]): string {
  if (!hourSlots || hourSlots.length === 0) return '';
  const parseHour = (s: string) => parseInt(s.split(':')[0], 10) || 0;
  const start = parseHour(hourSlots[0]);
  const last = parseHour(hourSlots[hourSlots.length - 1]);
  const end = (last + 1) % 24;
  const endDisplay = end === 0 ? 24 : end;
  return `${start}시-${endDisplay}시`;
}
