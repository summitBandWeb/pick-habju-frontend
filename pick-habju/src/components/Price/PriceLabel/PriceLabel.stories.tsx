/** PriceLabel 스토리: 기본·즐겨찾기·추가룸·부분·활성 등 변형 */
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

/** 기본 가격 라벨 */
export const Default: Story = {
  args: {
    priceText: '29,000',
    favorite: 'off',
    extraRoomCount: 0,
  },
};

/** 즐겨찾기 켜진 가격 라벨 */
export const Favorite: Story = {
  args: {
    priceText: '29,000',
    favorite: 'on',
    extraRoomCount: 0,
  },
};

/** 추가 룸 개수 칩이 있는 가격 라벨 */
export const ExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    favorite: 'off',
    extraRoomCount: 3,
  },
};

/** 즐겨찾기 + 추가 룸 칩 */
export const FavoriteWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    favorite: 'on',
    extraRoomCount: 3,
  },
};

/** 부분(일부) 상태 */
export const Partial: Story = {
  args: {
    priceText: '29,000',
    isPartial: true,
    favorite: 'off',
    extraRoomCount: 0,
  },
};

/** 부분 + 즐겨찾기 */
export const PartialFavorite: Story = {
  args: {
    priceText: '29,000',
    isPartial: true,
    favorite: 'on',
    extraRoomCount: 0,
  },
};

/** 부분 + 추가 룸 칩 */
export const PartialExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    isPartial: true,
    favorite: 'off',
    extraRoomCount: 3,
  },
};

/** 부분 + 즐겨찾기 + 추가 룸 칩 */
export const PartialFavoriteWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    isPartial: true,
    favorite: 'on',
    extraRoomCount: 3,
  },
};

/** 클릭 후 활성(선택) 상태 */
export const ActiveSelected: Story = {
  args: {
    priceText: '29,000',
    favorite: 'off',
    extraRoomCount: 0,
    isActive: true,
  },
};

/** 활성 상태 + 추가 룸 칩 */
export const ActiveSelectedWithExtraRoom: Story = {
  args: {
    priceText: '39,000~',
    favorite: 'off',
    extraRoomCount: 3,
    isActive: true,
  },
};

