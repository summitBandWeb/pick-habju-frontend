import type { BtnSizeVariant, ButtonVariant } from './ButtonEnums';

export interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: BtnSizeVariant;
  className?: string;
}
