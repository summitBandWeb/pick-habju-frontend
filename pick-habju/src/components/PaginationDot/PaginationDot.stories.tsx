import type { Meta, StoryObj } from '@storybook/react';
import PaginationDots from './PaginationDot';
import type { PaginationDotsProps } from './PaginationDot.types';

const meta: Meta<PaginationDotsProps> = {
  title: 'Components/PaginationDots',
  component: PaginationDots,
  tags: ['autodocs'],
  argTypes: {
    total: {
      control: { type: 'number', min: 1, step: 1 },
    },
    current: {
      control: { type: 'number', min: 0, step: 1 },
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#FFFFFF' },
      ],
    },
  },
};
export default meta;
type Story = StoryObj<PaginationDotsProps>;

export const OnePage: Story = {
  args: { total: 2, current: 0 },
};

export const TwoPages: Story = {
  args: { total: 3, current: 0 },
};

export const ThreePages: Story = {
  args: { total: 4, current: 0 },
};

export const FourPages: Story = {
  args: { total: 5, current: 0 },
};
