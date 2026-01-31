import type { BtnSizeVariant } from '../Button/ButtonEnums';

export interface CardProps {
  images: string[];
  title: string;
  subtitle: string;
  price: number;
  capacity: string;
  booked?: boolean;
  partialAvailable?: boolean;
  reOpenDaysFromNow?: number;
  btnsize?: BtnSizeVariant;
  isLiked?: boolean;
  onLike?: () => void; // 즐겨찾기 클릭 이벤트 핸들러
  onBookClick?: () => void;
}
