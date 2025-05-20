import classNames from 'classnames';
import { ButtonVariant, BtnSizeVariant } from '../../enums/components';
import type { ButtonProps } from './Button.types';
import { baseStyle, sizeStyles, variantStyles } from './ButtonStyle';

const Button = ({
  label,
  variant = ButtonVariant.Main,
  disabled = false,
  onClick,
  size = BtnSizeVariant.DEFAULT,
}: ButtonProps) => {
  const classes = classNames(
    baseStyle,
    ...variantStyles[variant],
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
