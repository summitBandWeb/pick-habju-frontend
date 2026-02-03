import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import '../../../styles/calendarCustom.css';
import DateNum from '../DateNum/DateNum';
import type { DatePickerBodyProps } from './DatePickerBody.types';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const slideVariants = {
  enter: (direction: 'prev' | 'next') => ({
    x: direction === 'next' ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'prev' | 'next') => ({
    x: direction === 'next' ? '-100%' : '100%',
    opacity: 0,
  }),
};

function getDaysGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length < 42) cells.push(null);
  return cells;
}

const DatePickerBody = ({
  activeStartDate = new Date(),
  slideDirection = 'next',
  selectedDates,
  onChange,
}: DatePickerBodyProps) => {
  const year = activeStartDate.getFullYear();
  const month = activeStartDate.getMonth();
  const monthKey = `${year}-${month}`;
  const daysGrid = useMemo(() => getDaysGrid(year, month), [year, month]);

  return (
    <div className="date-picker-body-wrapper w-full pt-2">
      {/* 고정: 요일 헤더 */}
      <div className="date-picker-weekdays grid grid-cols-7 justify-items-center mb-2.5 text-base font-medium">
        {WEEKDAYS.map((day) => (
          <div key={day} className="w-10 h-10 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* 슬라이드: 날짜 숫자 그리드 */}
      <div className="overflow-hidden relative min-h-[240px]">
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={monthKey}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0 w-full grid grid-cols-7"
          >
            {daysGrid.map((date, i) => (
              <div key={i} className="flex items-center justify-center p-1">
                {date ? (
                  <DateNum
                    date={date}
                    currentMonth={activeStartDate.getMonth()}
                    selectedList={selectedDates}
                    onSelect={onChange}
                  />
                ) : (
                  <div className="w-10 h-10" aria-hidden />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DatePickerBody;
