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
  btnsize?: BtnSizeVariant;
  initialIndex?: number;
}
