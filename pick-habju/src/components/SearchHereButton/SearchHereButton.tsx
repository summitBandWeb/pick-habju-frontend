import SyncIcon from '../../assets/svg/Sync.svg?react';
import type { SearchHereButtonProps } from './SearchHereButton.types';

const SearchHereButton = ({ onClick }: SearchHereButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        h-10 rounded-[6.25rem] shadow-filter px-4 py-2.5 
        flex gap-1.25 items-center justify-center
        outline-none border border-transparent 
        transition-colors
        bg-primary-white text-gray-400 
        hover:bg-yellow-300
      "
    >
      <SyncIcon className="w-4 h-4 shrink-0" />
      <span className="font-modal-call whitespace-nowrap">이 위치에서 검색</span>
    </button>
  );
};

export default SearchHereButton;
