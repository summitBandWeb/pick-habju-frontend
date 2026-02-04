'use client';

import { useState } from 'react';

import type { DatePickerProps } from './DatePicker.types';

import DatePickerHeader from './Header/DatePickerHeader';
import DatePickerBody from './Body/DatePickerBody';

type SlideDirection = 'prev' | 'next';

/**
 * DatePicker.tsx
 *
 * 날짜 선택기 컴포넌트 (달력 UI: Header + Body)
 * 선택된 날짜는 onChange로 외부에 전달됩니다.
 * 푸터(취소/확인)는 상위 컴포넌트에서 렌더링합니다.
 */

const DatePicker = ({ onChange, initialSelectedDate }: DatePickerProps) => {
  const today = new Date();
  const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // 항상 기본 선택은 '당일' (초기값 전달 시 해당 날짜로 설정)
  const initialSelected = initialSelectedDate
    ? new Date(initialSelectedDate.getFullYear(), initialSelectedDate.getMonth(), initialSelectedDate.getDate())
    : todayAtMidnight;
  const [selected, setSelected] = useState<Date[]>([initialSelected]);
  const [activeStartDate, setActiveStartDate] = useState<Date>(() => {
    // 초기 표시 월을 선택된 날짜의 월로 맞춘다
    return new Date(initialSelected.getFullYear(), initialSelected.getMonth(), 1);
  });
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('next');

  // 외부에서 props로 selectedDates를 전달했을 때, 업데이트 하기 위한 로직입니다.
  // selectedDates를 삭제 처리하였습니다. (부모에서 전달할 수 없습니다.)

  const toggleDate = (date: Date) => {
    const exists = selected.some((d) => d.getTime() === date.getTime());

    // 단일 선택만 허용, 그리고 항상 최소 1개(기본: 당일) 유지
    const updated = exists ? [todayAtMidnight] : [date];

    setSelected(updated);
    onChange?.(updated);
  };

  // 이전/다음 달 이동 (슬라이드 방향 설정 후 헤더·캘린더 동시 업데이트)
  const prev = () => {
    setSlideDirection('prev');
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1));
  };
  const next = () => {
    setSlideDirection('next');
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1, 1));
  };

  return (
    <div className="inline-block w-[19.875rem] bg-primary-white overflow-hidden pt-1 pb-2 px-0">
      <DatePickerHeader current={activeStartDate} onPrev={prev} onNext={next} />
      <DatePickerBody
        activeStartDate={activeStartDate}
        slideDirection={slideDirection}
        selectedDates={selected ?? []}
        onChange={toggleDate}
      />
    </div>
  );
};

export default DatePicker;
