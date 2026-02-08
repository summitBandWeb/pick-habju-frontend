import FaveOnIcon from '../../assets/svg/FaveOn.svg?react';
import type { FavoriteButtonProps } from './FavoriteButton.types';

const FavoriteButton = ({ isActive = false, onToggle }: FavoriteButtonProps) => {
  const handleClick = () => {
    const nextValue = !isActive;
    onToggle?.(nextValue);
  };

  return (
    <button
      type="button"
      className={`h-10 rounded-[6.25rem] shadow-filter px-4 py-2.5 flex gap-1.25 items-center outline-none border border-transparent transition-colors ${
        isActive
          ? 'bg-yellow-700 text-primary-white [&_path]:fill-primary-white [&_path]:stroke-primary-white'
          : 'bg-primary-white text-gray-300 hover:bg-gray-200 [&_path]:fill-gray-300 [&_path]:stroke-gray-300'
      }`}
      onClick={handleClick}
    >
      <FaveOnIcon className="w-5 h-[1.0625rem] shrink-0" />
      <span className="font-modal-call whitespace-nowrap">찜한 합주실</span>
    </button>
  );
};

export default FavoriteButton;
