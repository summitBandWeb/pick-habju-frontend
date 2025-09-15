import GuestIcon from '../../../../assets/svg/guestIcon.svg';
import type { KeyboardEvent } from 'react';
import type { PersonCountInputProps } from './PersonCountInput.types';

const PersonCountInput = ({ count, onChangeClick }: PersonCountInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChangeClick();
    }
  };
  return (
    <div
      className="w-70 h-14 rounded-lg bg-primary-white flex items-center justify-between px-3.5 cursor-pointer select-none"
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
      <span className="text-blue-500 px-3 py-4 font-hero-edit underline underline-offset-2">변경</span>
    </div>
  );
};

export default PersonCountInput;
