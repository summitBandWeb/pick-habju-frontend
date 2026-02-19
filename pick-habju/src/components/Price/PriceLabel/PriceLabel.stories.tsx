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
    favorite: {
      control: { type: 'select' },
      options: ['off', 'on'],
    },
    isPartial: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof PriceLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    priceText: '29,000',
    favorite: 'off',
    extraRoomCount: 0,
  },
};

export const Favorite: Story = {
  args: {
    priceText: '29,000',
    favorite: 'on',
    extraRoomCount: 0,
  },
};

export const ExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    favorite: 'off',
    extraRoomCount: 3,
  },
};

export const FavoriteWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    favorite: 'on',
    extraRoomCount: 3,
  },
};

export const Partial: Story = {
  args: {
    priceText: '29,000',
    isPartial: true,
    favorite: 'off',
    extraRoomCount: 0,
  },
};

export const PartialFavorite: Story = {
  args: {
    priceText: '29,000',
    isPartial: true,
    favorite: 'on',
    extraRoomCount: 0,
  },
};

export const PartialExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    isPartial: true,
    favorite: 'off',
    extraRoomCount: 3,
  },
};

export const PartialFavoriteWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    isPartial: true,
    favorite: 'on',
    extraRoomCount: 3,
  },
};

export const ActiveSelected: Story = {
  args: {
    priceText: '29,000',
    favorite: 'off',
    extraRoomCount: 0,
    isActive: true,
  },
};

export const ActiveSelectedWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    favorite: 'off',
    extraRoomCount: 3,
    isActive: true,
  },
};

