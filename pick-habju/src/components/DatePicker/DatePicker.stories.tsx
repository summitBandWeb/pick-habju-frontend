// src/components/DatePicker/DatePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker from './DatePicker';
import type { DatePickerProps } from './DatePicker.types';

const today = new Date();
today.setHours(0, 0, 0, 0);

const meta: Meta<DatePickerProps> = {
  title: 'Components/DatePicker/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    layout: 'centered',
  },
  argTypes: {
    selectedDates: {
      control: { type: 'object' },
      description: '초기 선택 날짜 배열',
    },
    onChange: { action: 'dateChanged', table: { disable: true } },
    onCancel: { action: 'canceled', description: '취소 콜백' },
    onConfirm: { action: 'confirmed', description: '확인 콜백' },
  },
};
export default meta;

type Story = StoryObj<DatePickerProps>;

// Interactive wrapper to manage state internally
const InteractiveWrapper = (args: DatePickerProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>(args.selectedDates || []);
  return (
    <div className="p-8 bg-black">
      <DatePicker
        {...args}
        selectedDates={selectedDates}
        onChange={(dates) => setSelectedDates(dates)}
        onConfirm={(dates) => console.log('Confirmed dates:', dates)}
        onCancel={() => console.log('Cancelled')}
      />
    </div>
  );
};

export const Default: Story = {
  name: 'Default (Interactive)',
  render: (args) => <InteractiveWrapper {...args} />,
};
