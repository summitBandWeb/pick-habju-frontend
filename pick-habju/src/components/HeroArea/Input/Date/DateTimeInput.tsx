import CalendarIcon from '../../../../assets/svg/calendarIcon.svg';
import type { DateTimeInputProps } from './DateTimeInput.types';

const DateTimeInput = ({ dateTime, onChangeClick }: DateTimeInputProps) => {
  return (
    <div className="w-70 h-14 rounded-lg bg-primary-white flex items-center justify-between px-3.5">
      <div className="flex items-center justify-center text-primary-black font-hero-info gap-2">
        <img src={CalendarIcon} alt="Calendar Icon" />
        <p>{dateTime}</p>
      </div>
      <button onClick={onChangeClick} className="text-blue-500 px-3 py-4 font-hero-edit underline">
        변경
      </button>
    </div>
  );
};

export default DateTimeInput;
