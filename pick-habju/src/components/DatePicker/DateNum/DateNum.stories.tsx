import type { Meta, StoryObj } from '@storybook/react';
import type { DateNumProps } from './DateNum.types';
import DateNum from './DateNum';

const meta: Meta<DateNumProps> = {
  title: 'Components/DatePicker/DateNum',
  component: DateNum,
  tags: ['autodocs'],
  argTypes: {
    date: { control: 'date' },
    currentMonth: { control: 'number' },
    selectedList: { control: { type: 'object' } },
    onSelect: { action: '날짜 선택됨' },
  },
};

export default meta;

type Story = StoryObj<DateNumProps>;

const today = new Date();
today.setHours(0, 0, 0, 0);

export const Default: Story = {
  name: 'Available Date (Default)',
  args: {
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
    currentMonth: today.getMonth(),
    selectedList: [],
    onSelect: (d) => console.log('선택:', d),
  },
};

export const PastDate: Story = {
  name: 'Past Date',
  args: {
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
    currentMonth: today.getMonth(),
    selectedList: [],
    onSelect: (d) => console.log('선택:', d),
  },
};

export const Today: Story = {
  name: 'Today',
  args: {
    date: today,
    currentMonth: today.getMonth(),
    selectedList: [],
    onSelect: (d) => console.log('선택:', d),
  },
};

export const Selected: Story = {
  name: 'Selected Date',
  args: {
    date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2),
    currentMonth: today.getMonth(),
    selectedList: [new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2)],
    onSelect: (d) => console.log('선택:', d),
  },
};

export const EmptyCell: Story = {
  name: 'Empty (Other Month)',
  args: {
    date: new Date(today.getFullYear(), today.getMonth() - 1, 28),
    currentMonth: today.getMonth(),
    selectedList: [],
    onSelect: (d) => console.log('선택:', d),
  },
};
