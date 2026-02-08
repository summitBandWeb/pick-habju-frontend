import type { Meta, StoryObj } from '@storybook/react';
import FavoriteButton from './FavoriteButton';

const meta = {
  title: 'Components/FavoriteButton',
  component: FavoriteButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FavoriteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 (비활성) 상태
export const Default: Story = {
  args: {
    isActive: false,
    onToggle: (nextValue: boolean) => console.log('Toggled:', nextValue),
  },
};

// 활성 상태
export const Active: Story = {
  args: {
    isActive: true,
    onToggle: (nextValue: boolean) => console.log('Toggled:', nextValue),
  },
};
