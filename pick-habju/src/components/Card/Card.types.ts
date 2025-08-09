import type { BtnSizeVariant } from '../Button/ButtonEnums';

export interface CardProps {
  images: string[];
  title: string;
  subtitle: string;
  price: number;
  locationText: string;
  walkTime: string;
  capacity: string;
  booked?: boolean;
  partialAvailable?: boolean;
  reOpenDaysFromNow?: number;
  btnsize?: BtnSizeVariant;
  initialIndex?: number;
}
