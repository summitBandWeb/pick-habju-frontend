import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePickerBody from './DatePickerBody';
import type { DatePickerBodyProps } from './DatePickerBody.types';

const meta: Meta<DatePickerBodyProps> = {
  title: 'Components/DatePicker/DatePickerBody',
  component: DatePickerBody,
  tags: ['autodocs'],
};

export default meta;

const Template = () => {
  // 단일 선택용 Date[] 상태 (최대 1개만 유지)
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);

  const toggleDate = (date: Date) => {
    const exists = selectedDates.some((d) => d.toDateString() === date.toDateString());
    const updated = exists ? [] : [date];
    setSelectedDates(updated);
    console.log('현재 선택된 날짜:', updated);
  };

  const [activeMonth, setActiveMonth] = useState(new Date(selectedDates[0].getFullYear(), selectedDates[0].getMonth(), 1));
  const [slideDirection, setSlideDirection] = useState<'prev' | 'next'>('next');

  const goPrev = () => {
    setSlideDirection('prev');
    setActiveMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };
  const goNext = () => {
    setSlideDirection('next');
    setActiveMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  return (
    <div className="p-4 bg-white w-90">
      <div className="flex justify-between mb-2">
        <button type="button" onClick={goPrev}>
          ← 이전
        </button>
        <button type="button" onClick={goNext}>
          다음 →
        </button>
      </div>
      <DatePickerBody
        activeStartDate={activeMonth}
        slideDirection={slideDirection}
        selectedDates={selectedDates}
        onChange={toggleDate}
      />
    </div>
  );
};

export const Default: StoryObj<DatePickerBodyProps> = {
  render: () => <Template />,
};
