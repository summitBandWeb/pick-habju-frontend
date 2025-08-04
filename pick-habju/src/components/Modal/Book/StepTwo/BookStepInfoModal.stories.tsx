import type { Meta, StoryObj } from '@storybook/react';
import BookStepInfoCheck from './BookStepInfoModal';

const meta: Meta<typeof BookStepInfoCheck> = {
  title: 'Modal/BookStepInfoCheck',

  component: BookStepInfoCheck,
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

type Story = StoryObj<typeof BookStepInfoCheck>;

export const Default: Story = {
  args: {
    date: '2025년 5월 23일 금요일',
    time: '17시 ~ 20시',
    location: '준사운드 S룸',
    peopleCount: 10,
    amount: 55000,
    onConfirm: () => alert('예약이 완료되었습니다!'),
  },
};
