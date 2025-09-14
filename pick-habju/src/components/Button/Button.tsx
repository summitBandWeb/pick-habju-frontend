import classNames from 'classnames';
import type { ButtonProps } from './Button.types';
import { baseStyle, sizeStyles, variantStyles } from './ButtonStyle';
import { BtnSizeVariant, ButtonVariant } from './ButtonEnums';

const Button = ({
  label,
  variant = ButtonVariant.Main,
  disabled = false,
  onClick,
  size = BtnSizeVariant.DEFAULT,
  className,
}: ButtonProps) => {
  const isDisabled = !!disabled;

  const classes = classNames(
    baseStyle,
    sizeStyles[size],
    isDisabled ? 'bg-gray-200 text-gray-300 cursor-not-allowed' : variantStyles[variant],
    className
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    // 인자가 있을 경우를 생각
    onClick?.(e);
  };
  return (
    <button type="button" className={classes} disabled={disabled} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Button;
