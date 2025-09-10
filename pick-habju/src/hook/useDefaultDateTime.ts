import { useMemo } from 'react';

export interface DefaultDateTime {
  defaultDateIso: string;
  defaultSlots: string[];
  defaultDateTimeLabel: string;
  defaultPeopleCount: number;
}

export const useDefaultDateTime = (): DefaultDateTime => {
  return useMemo(() => {
    // 현재 시간에서 다음 정시로 올림 (예: 14:00 -> 15:00, 14:03 -> 15:00)
    // 의도적으로 컴포넌트 마운트 시점의 시간으로 고정
    // 사용자가 페이지를 오래 열어두더라도 초기 선택된 시간대가 바뀌지 않도록 함
    const now = new Date();
    const baseDate = new Date(now);
    let startHour = now.getHours() + 1;

    if (startHour === 24) {
      // 자정 넘어가는 경우: 날짜 +1, 00시 시작
      baseDate.setDate(baseDate.getDate() + 1);
      startHour = 0;
    }

    const month = baseDate.getMonth() + 1;
    const day = String(baseDate.getDate()).padStart(2, '0');
    const weekdayKorean = ['일', '월', '화', '수', '목', '금', '토'][baseDate.getDay()];

    const rawEndHour = (startHour + 2) % 24;
    const displayEndHour = rawEndHour === 0 ? 24 : rawEndHour <= startHour ? rawEndHour + 24 : rawEndHour;

    const defaultDateIso = `${baseDate.getFullYear()}-${String(month).padStart(2, '0')}-${day}`;
    const defaultSlots = [
      `${String(startHour).padStart(2, '0')}:00`,
      `${String((startHour + 1) % 24).padStart(2, '0')}:00`,
    ];
    const defaultDateTimeLabel = `${month}월 ${day}일 (${weekdayKorean}) ${startHour}~${displayEndHour}시`;
    const defaultPeopleCount = 12;

    return {
      defaultDateIso,
      defaultSlots,
      defaultDateTimeLabel,
      defaultPeopleCount,
    };
  }, []); // 의도적으로 빈 배열 - 컴포넌트 마운트 시 한 번만 계산하여 초기값 고정
};
