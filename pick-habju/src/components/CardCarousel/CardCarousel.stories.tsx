import type { Meta, StoryObj } from '@storybook/react';
import CardCarousel from './CardCarousel';
import { ROOMS } from '../../constants/data';
import type { CardCarouselRoom } from './CardCarousel.types';

const rooms: CardCarouselRoom[] = ROOMS.map((r) => ({
  name: r.name,
  branch: r.branch,
  businessId: r.businessId,
  bizItemId: r.bizItemId,
  imageUrls: r.imageUrls,
  recommendCapacityRange: [Math.max(1, r.recommendCapacity - 2), r.recommendCapacity] as [number, number],
  estimatedPrice: r.pricePerHour * 2,
  pricePerHour: r.pricePerHour,
  partialAvailable: false,
}));

const meta = {
  title: 'Components/CardCarousel',
  component: CardCarousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false } },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    rooms,
    selectedRoomId: rooms[0]?.bizItemId ?? null,
    isOpen: true,
    onCardChange: () => {},
    onBookClick: () => {},
  },
  argTypes: {
    onCardChange: { action: 'cardChange' },
  },
} satisfies Meta<typeof CardCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    selectedRoomId: rooms[0]?.bizItemId ?? null,
  },
};

export const Mobile: Story = {
  args: {
    isOpen: true,
    selectedRoomId: rooms[0]?.bizItemId ?? null,
    forceDevice: 'mobile',
  },
};

// 단일 카드 케이스
export const SingleCard: Story = {
  args: {
    rooms: [rooms[0]],
    selectedRoomId: rooms[0]?.bizItemId ?? null,
  },
};
