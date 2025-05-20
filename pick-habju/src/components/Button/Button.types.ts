import type { BtnSizeVariant, ButtonVariant } from './ButtonEnums';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  size?: BtnSizeVariant;
}
