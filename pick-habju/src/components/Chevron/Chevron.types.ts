import type { ChevronVariant } from './ChevronEnums';

export interface ChevronProps {
  variant: ChevronVariant;
  onPrev?: () => void;
  onNext?: () => void;
}
