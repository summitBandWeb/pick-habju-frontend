import CalendarIcon from '../../../../assets/svg/calendarIcon.svg';
import type { KeyboardEvent } from 'react';
import type { DateTimeInputProps } from './DateTimeInput.types';

const DateTimeInput = ({ dateTime, onChangeClick }: DateTimeInputProps) => {
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
      aria-label="날짜/시간 변경"
      onClick={onChangeClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-center text-primary-black font-hero-info gap-2">
        <img src={CalendarIcon} alt="Calendar Icon" />
        <p>{dateTime}</p>
      </div>
      <span className="text-blue-500 px-3 py-4 font-hero-edit underline underline-offset-2">변경</span>
    </div>
  );
};

export default DateTimeInput;
