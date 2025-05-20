import type { DateNumProps } from './DateNum.types';

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const DateNum = ({ date, currentMonth, selectedList, onSelect }: DateNumProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const isEmpty = date.getMonth() !== currentMonth;
  const isToday = isSameDay(d, today);
  const isSelected = selectedList.some((sel) => isSameDay(sel, d));
  const isPastDate = d.getTime() < today.getTime();
  const isAvailable = !isEmpty && !isPastDate;

  let cls = 'flex items-center justify-center w-12 h-12 font-modal-default rounded-full transition';
  if (isEmpty) cls += ' text-gray-300 cursor-default';
  else if (isSelected) cls += ' bg-yellow-900 text-primary-black';
  else if (isToday) cls += ' text-primary-black border border-gray-600 hover:border-none hover:bg-yellow-700';
  else if (isPastDate) cls += ' text-gray-300 cursor-not-allowed';
  else if (isAvailable) cls += ' text-primary-black hover:bg-yellow-700 cursor-pointer';

  return (
    <div
      className={cls}
      onClick={() => {
        if (isAvailable) onSelect(date);
      }}
      role="button"
      aria-disabled={isEmpty || isPastDate}
      aria-label={`${date.getDate()}일`}
    >
      {!isEmpty ? date.getDate() : ''}
    </div>
  );
};

export default DateNum;
