import type { ChevronVariant } from '../../enums/components';

export interface ChevronProps {
  variant: ChevronVariant;
  onPrev?: () => void;
  onNext?: () => void;
}
