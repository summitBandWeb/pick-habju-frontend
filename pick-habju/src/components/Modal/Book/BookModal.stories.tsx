import type { Meta, StoryObj } from '@storybook/react';
import BookModalStepper from './BookModal';

const meta = {
  title: 'Modal/BookModal',
  component: BookModalStepper,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component:
          '예약 프로세스를 위한 2단계 스테퍼 컴포넌트입니다. 1단계에서 금액을 확인하고, 2단계에서 예약 정보를 최종 확인합니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BookModalStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  name: '기본',
  parameters: {
    docs: {
      description: {
        story: '기본적인 예약 스테퍼 화면입니다. 1단계 금액 확인부터 시작됩니다.',
      },
    },
  },
};

// 스테퍼 전체 플로우를 보여주는 스토리
export const FullFlow: Story = {
  name: '전체 플로우',
  parameters: {
    docs: {
      description: {
        story: '예약 스테퍼의 전체 플로우를 확인할 수 있습니다. 각 단계를 차례로 진행해보세요.',
      },
    },
  },
};
