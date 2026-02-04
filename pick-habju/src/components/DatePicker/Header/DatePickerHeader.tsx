import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { DatePickerHeaderProps } from './DatePickerHeader.types';

const DatePickerHeader = ({ current, onPrev, onNext }: DatePickerHeaderProps) => (
  <div className="flex items-center justify-center gap-6 px-4 py-2 bg-white rounded-t-lg">
    <button onClick={onPrev} aria-label="이전 달" className="p-[0.63rem] font-modal-num text-primary-black">
      <ChevronLeftIcon className="w-7 h-7" />
    </button>
    <div className="flex items-center font-modal-default text-primary-black">
      <span className="py-3 px-1">{current.getFullYear()}년</span>
      <span className="py-3 px-1">{current.getMonth() + 1}월</span>
    </div>
    <button onClick={onNext} aria-label="다음 달" className="p-[0.63rem] font-modal-default text-primary-black">
      <ChevronRightIcon className="w-7 h-7" />
    </button>
  </div>
);

export default DatePickerHeader;
