import GuestIcon from '../../../../assets/svg/guestIcon.svg';
import type { KeyboardEvent } from 'react';
import type { PersonCountInputProps } from './PersonCountInput.types';

const PersonCountInput = ({ count, onChangeClick, isOpen = false }: PersonCountInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChangeClick();
    }
  };
  return (
    <div
      className="h-14 w-full flex items-center justify-between py-1 px-3.5 cursor-pointer select-none bg-primary-white"
      role="button"
      tabIndex={0}
      aria-label="인원 변경"
      onClick={onChangeClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-center text-primary-black font-hero-info gap-2">
        <img src={GuestIcon} alt="Guest Icon" />
        <p>인원 {count}명</p>
      </div>
      <span
        className={`px-3 py-4 font-hero-edit underline underline-offset-2 ${isOpen ? 'text-blue-300' : 'text-blue-500'}`}
      >
        변경
      </span>
    </div>
  );
};

export default PersonCountInput;
