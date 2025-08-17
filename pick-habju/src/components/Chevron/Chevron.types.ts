import type { ChevronVariant } from './ChevronEnums';

export interface ChevronProps {
  variant: ChevronVariant;
  onPrev?: () => void;
  onNext?: () => void;
  /**
   * 외부 컨테이너 폭/레이아웃을 커스터마이즈하기 위한 클래스
   * 기본값은 기존과 동일하게 min-w-80
   */
  containerClassName?: string;
}
