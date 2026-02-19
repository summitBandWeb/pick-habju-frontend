export interface PriceListRoom {
  id: string | number;
  name: string;
  priceText: string;
}

export interface PriceListProps {
  rooms: PriceListRoom[];
  isOpen?: boolean;
  className?: string;
  onRoomClick?: (room: PriceListRoom) => void;
}
