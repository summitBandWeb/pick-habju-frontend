import type { Meta, StoryObj } from '@storybook/react';
import CardCarousel from './CardCarousel';
import { ROOMS } from '../../constants/data';
import type { RoomMetadata } from '../../types/RoomMetadata';

const rooms = ROOMS as RoomMetadata[];

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
