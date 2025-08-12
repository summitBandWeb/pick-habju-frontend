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

export function formatTimeRangeFromSlots(hourSlots: string[]): string {
  if (!hourSlots || hourSlots.length === 0) return '';
  const parseHour = (s: string) => parseInt(s.split(':')[0], 10) || 0;
  const start = parseHour(hourSlots[0]);
  const last = parseHour(hourSlots[hourSlots.length - 1]);
  const end = (last + 1) % 24;
  const endDisplay = end === 0 ? 24 : end;
  return `${start}시-${endDisplay}시`;
}
