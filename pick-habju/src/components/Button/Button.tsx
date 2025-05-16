// src/components/Button/Button.tsx
import classNames from 'classnames';
import { ButtonVariant, BtnSizeVariant } from '../../enums/components';

interface ButtonProps {
  label: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  size?: BtnSizeVariant;
}

// 버튼 사이즈 별로 분리
const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  xsm: 'w-[91px] h-[43px] font-button',
  sm: 'w-[144px] h-[48px] font-button',
  default: 'w-[182.5px] h-[48px] font-button',
  md: 'w-[274px] h-[48px] font-button',
  lg: 'w-[294px] h-[43px] font-button',
};

const baseStyle = 'transition duration-200 flex items-center justify-center font-button rounded-[10px]';

// 버튼 종류별 스타일
const variantStyles: Record<ButtonVariant, string> = {
  [ButtonVariant.Main]: 'bg-[#f5be00] text-primary-black hover:bg-yellow-700',
  [ButtonVariant.Sub]: 'bg-[#e6e6e6] text-primary-black hover:bg-gray-100',
  [ButtonVariant.Text]: 'bg-primary-black text-yellow-900',
};

const Button = ({
  label,
  variant = ButtonVariant.Main,
  disabled = false,
  onClick,
  size = BtnSizeVariant.DEFAULT,
}: ButtonProps) => {
  const classes = classNames(
    baseStyle,
    variantStyles[variant],
    sizeStyles[size],
    disabled && 'bg-gray-200 text-gray-300 cursor-not-allowed'
  );

  return (
    <button type="button" className={classes} disabled={disabled} onClick={disabled ? undefined : onClick}>
      {label}
    </button>
  );
};

export default Button;
