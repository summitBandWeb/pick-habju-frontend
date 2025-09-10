'use client';

import { useState } from 'react';

import type { DatePickerProps } from './DatePicker.types';

import PickerFooter from '../PickerFooter/PickerFooter';
import DatePickerHeader from './Header/DatePickerHeader';
import DatePickerBody from './Body/DatePickerBody';

/**
 * DatePicker.tsx
 *
 * 날짜 선택기 컴포넌트
 * 사용자가 날짜를 선택할 수 있는 UI를 제공합니다.
 * 선택된 날짜는 외부에서 관리할 수 있으며, 확인/취소 버튼을 통해 선택을 완료하거나 취소할 수 있습니다.
 */

const DatePicker = ({ onChange, onConfirm, onCancel, initialSelectedDate }: DatePickerProps) => {
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

  // 외부에서 props로 selectedDates를 전달했을 때, 업데이트 하기 위한 로직입니다.
  // selectedDates를 삭제 처리하였습니다. (부모에서 전달할 수 없습니다.)

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const toggleDate = (date: Date) => {
    const exists = selected.some((d) => d.getTime() === date.getTime());

    // 단일 선택만 허용, 그리고 항상 최소 1개(기본: 당일) 유지
    const updated = exists ? [todayAtMidnight] : [date];

    setSelected(updated);
    onChange?.(updated);
  };

  // 이전/다음 달 이동
  const prev = () => {
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1));
  };
  const next = () => {
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1, 1));
  };

  const handleConfirm = () => {
    onConfirm?.(selected);
  };
  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="inline-block w-90 bg-primary-white rounded-xl overflow-hidden pt-4 px-2.5">
      <DatePickerHeader current={activeStartDate} onPrev={prev} onNext={next} />
      <DatePickerBody
        activeStartDate={activeStartDate}
        selectedDates={selected ?? []}
        onChange={toggleDate}
        onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setActiveStartDate(activeStartDate)}
      />
      {selected.length > 0 && isSameDay(selected[0], todayAtMidnight) && (
        <div className="flex w-full px-3 py-2.5 items-center justify-start">
          <p className="font-modal-calcdetail text-gray-300 text-left">
            당일 예약은 취소 시 전액 위약금이 발생합니다.
            <br />
            신중히 선택해주세요!
          </p>
        </div>
      )}
      <PickerFooter onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
};

export default DatePicker;
