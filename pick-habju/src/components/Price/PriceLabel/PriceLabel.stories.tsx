import type { Meta, StoryObj } from '@storybook/react';
import PriceLabel from './PriceLabel';

const meta = {
  title: 'Components/Map/Price/PriceLabel',
  component: PriceLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onClick: {
      action: 'clicked',
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'partial'],
    },
    favorite: {
      control: { type: 'select' },
      options: ['off', 'on'],
    },
    roomChip: {
      control: { type: 'select' },
      options: ['none', 'extra'],
    },
  },
} satisfies Meta<typeof PriceLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    priceText: '29,000',
    state: 'default',
    favorite: 'off',
    roomChip: 'none',
  },
};

export const Favorite: Story = {
  args: {
    priceText: '29,000',
    state: 'default',
    favorite: 'on',
    roomChip: 'none',
  },
};

export const ExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    state: 'default',
    favorite: 'off',
    roomChip: 'extra',
    extraRoomCount: 3,
  },
};

export const FavoriteWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    state: 'default',
    favorite: 'on',
    roomChip: 'extra',
    extraRoomCount: 3,
  },
};

export const Partial: Story = {
  args: {
    priceText: '29,000',
    state: 'partial',
    favorite: 'off',
    roomChip: 'none',
  },
};

export const PartialFavorite: Story = {
  args: {
    priceText: '29,000',
    state: 'partial',
    favorite: 'on',
    roomChip: 'none',
  },
};

export const PartialExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    state: 'partial',
    favorite: 'off',
    roomChip: 'extra',
    extraRoomCount: 3,
  },
};

export const PartialFavoriteWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    state: 'partial',
    favorite: 'on',
    roomChip: 'extra',
    extraRoomCount: 3,
  },
};

export const ActiveSelected: Story = {
  args: {
    priceText: '29,000',
    state: 'default',
    favorite: 'off',
    roomChip: 'none',
    isActive: true,
  },
};

export const ActiveSelectedWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    state: 'default',
    favorite: 'off',
    roomChip: 'extra',
    extraRoomCount: 3,
    isActive: true,
  },
};
