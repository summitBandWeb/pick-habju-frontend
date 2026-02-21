/** PriceList 스토리: 목록만 / PriceLabel과 연동 토글 */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import PriceLabel from '../PriceLabel/PriceLabel';
import PriceList from './PriceList';
import type { PriceListRoom } from './PriceList.types';

/** 스토리용 룸 목록 */
const rooms: PriceListRoom[] = [
  { id: 'a', name: 'A룸', priceText: '29,000' },
  { id: 'b', name: 'B룸', priceText: '119,000' },
  { id: 'c', name: 'C룸', priceText: '69,000' },
];

/** PriceLabel 클릭 시 PriceList 열림/닫힘을 토글하는 래퍼 */
const PriceListWithLabelTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    setIsActive(next);
  };

  return (
    <div className="relative h-56 flex items-end justify-center">
      <div className="relative inline-block">
        <PriceList
          rooms={rooms}
          isOpen={isOpen}
          className="absolute left-1/2 -translate-x-1/2 bottom-full"
          onRoomClick={(room) => console.log('room clicked:', room)}
        />
      <PriceLabel
        priceText="39,000~"
        extraRoomCount={3}
        favorite="off"
        isActive={isActive}
        onClick={handleToggle}
      />
      </div>
    </div>
  );
};

const meta = {
  title: 'Components/Map/Price/PriceList',
  component: PriceList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PriceList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 목록만 열린 상태 */
export const Default: Story = {
  args: {
    rooms,
    isOpen: true,
  },
};

/** PriceLabel 클릭으로 목록 토글하는 연동 예시 */
export const WithPriceLabelTrigger: Story = {
  args: {
    rooms,
  },
  render: () => <PriceListWithLabelTrigger />,
};
