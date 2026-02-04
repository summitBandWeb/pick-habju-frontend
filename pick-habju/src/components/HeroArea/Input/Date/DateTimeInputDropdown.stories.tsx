import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TimePeriod } from '../../../TimePicker/TimePickerEnums';
import DateTimeInputDropdown from './DateTimeInputDropdown';

const meta: Meta<typeof DateTimeInputDropdown> = {
  title: 'Input/DateTimeInputDropdown',
  component: DateTimeInputDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof DateTimeInputDropdown>;

const InteractiveWrapper = () => {
  const [dateTime, setDateTime] = useState('3월 26일 (수) 18-20시');

  return (
    <div className="p-8 min-w-80">
      <DateTimeInputDropdown
        dateTime={dateTime}
        initialSelectedDate={new Date()}
        onConfirm={(date, sh, sp, eh, ep) => {
          setDateTime(
            `${date.getMonth() + 1}월 ${date.getDate()}일 ${sh}${sp === TimePeriod.AM ? 'AM' : 'PM'}-${eh}${ep === TimePeriod.AM ? 'AM' : 'PM'}`
          );
          return true;
        }}
        onClose={() => console.log('드롭다운 닫힘')}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    dateTime: '3월 26일 (수) 18-20시',
    initialSelectedDate: new Date(),
    onConfirm: (date, sh, sp, eh, ep) => {
      console.log('날짜·시간 확정:', { date, sh, sp, eh, ep });
      return true;
    },
    onClose: () => console.log('취소 클릭'),
  },
};

export const Interactive: Story = {
  name: 'Interactive (날짜+시간 선택 후 표시 업데이트)',
  render: () => <InteractiveWrapper />,
};
