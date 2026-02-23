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
  
  // 즐겨찾기 관련 props (자동 관리)
  bizItemId?: string; // 즐겨찾기 API에 필요한 비즈니스 아이템 ID
  businessId?: string; // 즐겨찾기 API에 필요한 비즈니스 ID
  
  onBookClick?: () => void;
}
