import type { Meta, StoryObj } from '@storybook/react';
import SearchHereButton from './SearchHereButton';

const meta = {
  title: 'Components/SearchHereButton',
  component: SearchHereButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 이벤트 핸들러',
    },
  },
} satisfies Meta<typeof SearchHereButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 상태
export const Default: Story = {
  args: {
    onClick: () => console.log('이 위치에서 검색 클릭!'),
  },
};

// 인터랙티브 예시 (hover 상태를 확인하기 위한)
export const Interactive: Story = {
  args: {
    onClick: () => alert('이 위치에서 검색이 시작됩니다!'),
  },
  parameters: {
    docs: {
      description: {
        story: '마우스를 올려보면 배경색이 변경됩니다.',
      },
    },
  },
};
