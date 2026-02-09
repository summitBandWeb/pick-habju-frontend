import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'text',
      description: '검색어',
    },
    searchCondition: {
      control: 'object',
      description: '검색 조건 (장소, 인원수, 시간)',
    },
  },
  args: {
    onSearchChange: fn(),
    onConditionClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 검색바 (검색 조건 없음)
export const Default: Story = {
  args: {
    value: '',
  },
};

// 검색어 입력된 상태
export const WithText: Story = {
  args: {
    value: '비쥬',
  },
};

// 검색 조건이 있는 경우
export const WithSearchCondition: Story = {
  args: {
    value: '',
    searchCondition: {
      location: '이수',
      peopleCount: 13,
      dateTime: '01/04 16-18시',
    },
  },
};

// 검색어 + 검색 조건 모두 있는 경우 (Figma 디자인)
export const WithTextAndCondition: Story = {
  args: {
    value: '비쥬',
    searchCondition: {
      location: '이수',
      peopleCount: 13,
      dateTime: '01/04 16-18시',
    },
  },
};

// 다른 검색 조건 예시
export const AnotherExample: Story = {
  args: {
    value: '',
    searchCondition: {
      location: '홍대',
      peopleCount: 5,
      dateTime: '02/15 14-16시',
    },
  },
};
