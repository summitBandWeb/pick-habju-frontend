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
    <div className="w-[19.88rem] h-[17.5rem] px-[1.19rem]">
      {/* 고정: 요일 헤더 - 7열 40x40 셀, 간격 없음 */}
      <div className="date-picker-weekdays grid grid-cols-[repeat(7,2.5rem)] justify-items-center text-base font-medium">
        {WEEKDAYS.map((day) => (
          <div key={day} className="w-10 h-10 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      {/* 슬라이드: 날짜 숫자 그리드 - 7열 40x40 셀, 간격없이 붙어있음 */}
      <div className="overflow-hidden relative w-[17.5rem] h-[15rem]">
        <AnimatePresence initial={false} custom={slideDirection}>
          <motion.div
            key={monthKey}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="absolute inset-0 w-[17.5rem] grid grid-cols-[repeat(7,2.5rem)] grid-rows-6 place-items-center"
          >
            {daysGrid.map((date, i) =>
              date ? (
                <DateNum
                  key={i}
                  date={date}
                  currentMonth={activeStartDate.getMonth()}
                  selectedList={selectedDates}
                  onSelect={onChange}
                />
              ) : (
                <div key={i} className="w-10 h-10" aria-hidden />
              ),
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DatePickerBody;
