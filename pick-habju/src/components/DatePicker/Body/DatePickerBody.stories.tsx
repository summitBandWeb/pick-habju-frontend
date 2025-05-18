// src/components/DatePicker/Body/DatePickerBody.stories.tsx

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePickerBody, { type DatePickerBodyProps } from './DatePickerBody';

const meta: Meta<DatePickerBodyProps> = {
  title: 'Components/DatePicker/DatePickerBody',
  component: DatePickerBody,
  tags: ['autodocs'],
};

export default meta;

const Template = () => {
  // 다중 선택용 Date[] 상태
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);

  const toggleDate = (date: Date) => {
    const exists = selectedDates.some((d) => d.toDateString() === date.toDateString());
    setSelectedDates((prev) =>
      exists ? prev.filter((d) => d.toDateString() !== date.toDateString()) : [...prev, date]
    );
    console.log('현재 선택된 날짜들:', selectedDates);
  };

  return (
    <div className="p-4 bg-white">
      <DatePickerBody
        activeStartDate={new Date(selectedDates[0].getFullYear(), selectedDates[0].getMonth(), 1)}
        selectedDates={selectedDates}
        onChange={toggleDate}
        onActiveStartDateChange={({ activeStartDate }) => {
          console.log('보여지는 시작 월 변경:', activeStartDate);
        }}
      />
    </div>
  );
};

export const Default: StoryObj<DatePickerBodyProps> = {
  render: () => <Template />,
};
