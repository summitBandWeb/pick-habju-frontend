import type { BtnSizeVariant } from '../Button/ButtonEnums';

export interface CardProps {
  images: string[];
  title: string;
  subtitle: string;
  price: number;
  capacity: string;
  booked?: boolean;
  partialAvailable?: boolean;
  availableTimeRange?: string; // 일부 시간만 가능할 때 시간 범위 (예: "14-15시만 가능")
  reOpenDaysFromNow?: number;
  btnsize?: BtnSizeVariant;
  isLiked?: boolean;
  onLike?: () => void; // 즐겨찾기 클릭 이벤트 핸들러
  onBookClick?: () => void;
}
