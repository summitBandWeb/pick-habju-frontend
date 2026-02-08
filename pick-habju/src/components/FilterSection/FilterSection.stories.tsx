import type { Meta, StoryObj } from '@storybook/react';
import FilterSection from './FilterSection';

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
    isFavoriteFilterActive: false,
    onFavoriteFilterToggle: (isActive) => console.log('Favorite filter toggled:', isActive),
  },
};

// 찜한 합주실 필터 활성화 상태
export const FavoriteFilterActive: Story = {
  args: {
    isFavoriteFilterActive: true,
    onFavoriteFilterToggle: (isActive) => console.log('Favorite filter toggled:', isActive),
  },
};
