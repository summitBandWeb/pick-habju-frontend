// src/components/DatePicker/DatePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DatePicker from './DatePicker';
import type { DatePickerProps } from './DatePicker.types';

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
};
export default meta;

type Story = StoryObj<DatePickerProps>;

const InteractiveWrapper = (args: DatePickerProps) => {
  const [selected, setSelected] = useState<Date[]>(args.initialSelectedDate ? [args.initialSelectedDate] : []);

  return (
    <div className="p-8 bg-black">
      <DatePicker
        {...args}
        onChange={(dates) => {
          setSelected(dates);
          console.log('onChange:', dates);
        }}
        onConfirm={(dates) => console.log('onConfirm:', dates)}
        onCancel={() => console.log('onCancel')}
      />
      {/* 선택 상태 확인용 */}
      <pre style={{ color: 'white', marginTop: 12 }}>
        {selected.length ? selected[0].toISOString().slice(0, 10) : 'no selection'}
      </pre>
    </div>
  );
};

export const Default: Story = {
  name: 'Default (Interactive)',
  args: {
    initialSelectedDate: new Date(), // 기본값: 오늘
  },
  render: (args) => <InteractiveWrapper {...args} />,
};
