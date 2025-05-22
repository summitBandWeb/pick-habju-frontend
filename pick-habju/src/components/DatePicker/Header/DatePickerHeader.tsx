import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { DatePickerHeaderProps } from './DatePickerHeader.types';

const DatePickerHeader = ({ current, onPrev, onNext }: DatePickerHeaderProps) => (
  <div className="flex items-center justify-between px-4 py-2 bg-white rounded-t-lg">
    <button onClick={onPrev} aria-label="이전 달" className="font-modal-num text-primary-black">
      <ChevronLeftIcon />
    </button>
    <div className="flex items-center space-x-2 font-modal-default text-primary-black">
      <span>{current.getFullYear()}년</span>
      <span>{current.getMonth() + 1}월</span>
    </div>
    <button onClick={onNext} aria-label="다음 달" className="font-modal-default text-primary-black">
      <ChevronRightIcon />
    </button>
  </div>
);

export default DatePickerHeader;
