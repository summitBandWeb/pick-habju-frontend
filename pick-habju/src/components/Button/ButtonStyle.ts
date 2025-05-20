import { ButtonVariant } from '../../enums/components';
import type { ButtonProps } from './Button.types';

// 버튼 사이즈 별로 분리
export const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  xsm: 'w-[91px] h-[43px] font-button',
  sm: 'w-[144px] h-[48px] font-button',
  default: 'w-[182.5px] h-[48px] font-button',
  md: 'w-[274px] h-[48px] font-button',
  lg: 'w-[294px] h-[43px] font-button',
};

export const baseStyle = 'transition duration-200 flex items-center justify-center font-button rounded-[10px]';

export const variantStyles: Record<ButtonVariant, string[]> = {
  [ButtonVariant.Main]: ['bg-yellow-900', 'text-primary-black', 'hover:bg-yellow-700'],
  [ButtonVariant.Sub]: ['bg-gray-200', 'text-primary-black', 'hover:bg-gray-100'],
  [ButtonVariant.Text]: ['bg-primary-black', 'text-yellow-900'],
};
