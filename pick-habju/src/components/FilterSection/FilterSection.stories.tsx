import type { Meta, StoryObj } from '@storybook/react';
import FilterSection from './FilterSection';
import { SortType } from './FilterSection.constants';

const meta = {
  title: 'Components/FilterSection',
  component: FilterSection,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    sortValue: SortType.PRICE_LOW,
    onSortChange: (sortType) => console.log('Sort changed:', sortType),
  },
};
