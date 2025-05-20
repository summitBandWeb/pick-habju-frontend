import type { BtnSizeVariant, ButtonVariant } from '../../enums/components';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  size?: BtnSizeVariant;
}
