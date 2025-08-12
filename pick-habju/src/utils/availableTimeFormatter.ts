/**
 * available_slots에서 연속된 true 구간을 찾아 시간 범위 문자열로 변환
 * 예: { "15:00": true, "16:00": true, "17:00": false } → "15:00~17:00"
 */
export function formatAvailableTimeRange(availableSlots: Record<string, boolean | 'unknown'>): string {
  const entries = Object.entries(availableSlots).sort(([a], [b]) => (a < b ? -1 : 1));

  // 연속된 true 구간 찾기
  let start = '';
  let end = '';
  let inRange = false;

  for (const [timeSlot, available] of entries) {
    if (available === true) {
      if (!inRange) {
        start = timeSlot;
        inRange = true;
      }
      // 현재까지의 마지막 시간을 기록 (연속 구간의 끝을 추적)
      const [hour] = timeSlot.split(':');
      const nextHour = parseInt(hour, 10) + 1;
      const nextHourFormatted = nextHour === 24 ? '24' : String(nextHour).padStart(2, '0');
      end = `${nextHourFormatted}:00`;
    } else {
      // false 또는 'unknown'이면 연속 구간 종료
      if (inRange) {
        break; // 첫 번째 연속 구간만 반환
      }
    }
  }

  if (start && end) {
    const startHour = start.split(':')[0];
    const endHour = end.split(':')[0];
    return `${startHour}:00~${endHour}:00`;
  }

  return '';
}

/**
 * available_slots에서 "첫 번째 연속된 true 구간"의 슬롯 목록을 반환
 * 예: { "15:00": true, "16:00": true, "17:00": false } → ["15:00", "16:00"]
 */
export function extractFirstConsecutiveTrueSlots(
  availableSlots: Record<string, boolean | 'unknown'>
): string[] {
  const entries = Object.entries(availableSlots).sort(([a], [b]) => (a < b ? -1 : 1));
  const collected: string[] = [];
  let inRange = false;

  for (const [timeSlot, available] of entries) {
    if (available === true) {
      collected.push(timeSlot);
      inRange = true;
    } else if (inRange) {
      break; // 첫 번째 연속 구간 종료
    }
  }

  return collected;
}
