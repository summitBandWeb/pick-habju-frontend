import type { ButtonProps } from './Button.types';
import { ButtonVariant } from './ButtonEnums';

// 버튼 사이즈 별로 분리
export const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  xxsm: 'w-[5.7rem] h-[2.7rem] font-button', // 91px, 43px
  xsm: 'w-[9rem] h-[3rem] font-button', // 144px, 48px
  default: 'w-[11.4rem] h-[3rem] font-button', // 182.5px, 48px
  sm: 'w-[13.625rem] h-[3rem] font-button', // 218px, 48px
  md: 'w-[17.1rem] h-[3rem] font-button', // 274px, 48px
  lg: 'w-[18.4rem] h-[2.7rem] font-button', // 294px, 43px
};

export const baseStyle = 'transition duration-200 flex items-center justify-center font-button rounded-[10px]';

export const variantStyles: Record<ButtonVariant, string[]> = {
  [ButtonVariant.Main]: ['bg-yellow-900', 'text-primary-black', 'hover:bg-yellow-500'],
  [ButtonVariant.Ghost]: [
    'border border-yellow-900',
    'bg-primary-white text-yellow-900',
    'hover:bg-yellow-700 hover:text-primary-white',
  ],
  [ButtonVariant.GrayText]: [
    'bg-transparent',
    'text-gray-300 underline-gray-text',
    'hover:text-gray-200',
  ],
  [ButtonVariant.YellowText]: [
    'bg-transparent',
    'text-yellow-900',
    'hover:text-yellow-500',
  ],
};
