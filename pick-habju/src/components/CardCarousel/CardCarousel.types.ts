export interface CardCarouselRoom {
  name: string;
  branch: string;
  businessId: string;
  bizItemId: string;
  imageUrls: string[];
  recommendCapacity: number;
  pricePerHour: number;
}

export interface CardCarouselProps {
  rooms: CardCarouselRoom[];
  selectedRoomId: string | null;
  isOpen: boolean;
  onCardChange: (id: string) => void;
  forceDevice?: 'mobile' | 'desktop';
}

