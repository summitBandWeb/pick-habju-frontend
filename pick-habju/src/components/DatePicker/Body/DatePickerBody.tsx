import Calendar from 'react-calendar';
import '../../../styles/calendarCustom.css';
import DateNum from '../DateNum/DateNum';
import type { CalendarTileProps, DatePickerBodyProps } from './DatePickerBody.types';

const DatePickerBody = ({
  activeStartDate = new Date(),
  selectedDates,
  onChange,
  onActiveStartDateChange,
}: DatePickerBodyProps) => (
  <Calendar
    className="minimal-calendar pt-2"
    calendarType="gregory"
    // 지난 날짜 확실히 클릭 방지
    tileDisabled={({ date }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(date);
      target.setHours(0, 0, 0, 0);
      return target < today;
    }}
    showNavigation={false}
    activeStartDate={activeStartDate}
    onActiveStartDateChange={onActiveStartDateChange}
    onClickDay={onChange}
    formatDay={() => ''} // 기본 숫자 숨김
    tileContent={({ date, view }: CalendarTileProps) =>
      view === 'month' && (
        <DateNum
          date={date}
          currentMonth={activeStartDate.getMonth()}
          selectedList={selectedDates}
          onSelect={onChange}
        />
      )
    }
  />
);

export default DatePickerBody;
