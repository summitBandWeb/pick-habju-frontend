/** PriceChip 스토리: 추가 룸 개수 칩 */
import type { Meta, StoryObj } from '@storybook/react';
import PriceChip from './PriceChip';

const meta = {
  title: 'Components/Map/Price/PriceChip',
  component: PriceChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    count: {
      control: { type: 'number', min: 1 },
    },
  },
} satisfies Meta<typeof PriceChip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 칩 (개수 3) */
export const Default: Story = {
  args: {
    count: 3,
  },
};
