// 시간 슬롯 배열을 생성하는 함수 (예: 18시 ~ 20시 -> ["18:00", "19:00"])
export const generateHourSlots = (startHour24: number, endHour24: number): string[] => {
  const slots: string[] = [];
  // 종료 시간은 포함하지 않으므로, endHour24 직전까지만 반복
  let effectiveEnd = endHour24;
  if (effectiveEnd <= startHour24) {
    effectiveEnd += 24; // 자정 교차 허용
  }
  for (let i = startHour24; i < effectiveEnd; i++) {
    const hour = i % 24;
    slots.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return slots;
};
