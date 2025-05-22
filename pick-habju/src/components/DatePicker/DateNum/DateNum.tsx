import type { DateNumProps } from './DateNum.types';
import { baseStyle, dateNumVariants } from './DateNumStyles';

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

  let cls = baseStyle;
  if (isEmpty) cls += ` ${dateNumVariants.empty}`;
  else if (isSelected) cls += ` ${dateNumVariants.selected}`;
  else if (isToday) cls += ` ${dateNumVariants.today}`;
  else if (isPastDate) cls += ` ${dateNumVariants.past}`;
  else if (isAvailable) cls += ` ${dateNumVariants.available}`;

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
