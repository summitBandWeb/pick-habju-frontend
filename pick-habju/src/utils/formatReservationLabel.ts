export const formatReservationLabel = (dateIso: string, hourSlots: string[]): string => {
  if (!dateIso || hourSlots.length === 0) return '';
  const [year, monthStr, dayStr] = dateIso.split('-');
  const month = parseInt(monthStr, 10);
  const day = dayStr.padStart(2, '0');
  const dateObj = new Date(parseInt(year, 10), month - 1, parseInt(dayStr, 10));
  const weekdayKorean = ['일', '월', '화', '수', '목', '금', '토'][dateObj.getDay()];

  // 시작/종료 시간 계산
  const first = hourSlots[0];
  const last = hourSlots[hourSlots.length - 1];
  const startHour = parseInt(first.split(':')[0], 10);
  const endHourBase = parseInt(last.split(':')[0], 10) + 1;
  // 0시는 24시로 표기
  const endHour = endHourBase === 0 ? 24 : endHourBase;

  return `${month}월 ${day}일 (${weekdayKorean}) ${startHour}~${endHour}시`;
};
