import DatePickerHeader from '../Header/DatePickerHeader';
import DatePickerBody from '../Body/DatePickerBody';
import DatePickerFooter from '../Footer/DatePickerFooter';
import { useEffect, useState } from 'react';

export interface DatePickerProps {
  /* 초기 선택된 날짜들 */
  selectedDates?: Date[];
  /* 날짜 선택 시 호출되는 콜백 */
  onChange?: (dates: Date[]) => void;
  /* 확인 버튼 클릭 시 호출되는 콜백 */
  onConfirm?: (dates: Date[]) => void;
  /* 취소 버튼 클릭 시 호출되는 콜백 */
  onCancel?: () => void;
}

const DatePicker = ({ selectedDates = [], onChange, onConfirm, onCancel }: DatePickerProps) => {
  const [selected, setSelected] = useState<Date[]>(selectedDates);
  // 표시할 달력의 시작 날짜 (해당 월 1일)
  const [activeStartDate, setActiveStartDate] = useState<Date>(
    new Date(
      selectedDates[0]?.getFullYear() ?? new Date().getFullYear(),
      selectedDates[0]?.getMonth() ?? new Date().getMonth(),
      1
    )
  );

  // 외부 selectedDates prop 동기화
  useEffect(() => {
    // 단일 선택 모드이므로, 외부에서 여러 날짜가 들어와도 첫 번째 날짜만 반영
    setSelected(selectedDates.slice(0, 1));
  }, [selectedDates]);

  const toggleDate = (date: Date) => {
    const exists = selected.some(
      (d) =>
        d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
    );

    // 중복 선택 방지 로직:
    // 클릭된 날짜가 이미 선택된 날짜이면 선택 해제 (빈 배열)
    // 클릭된 날짜가 선택되지 않았으면 해당 날짜 하나만 선택 (해당 날짜를 가진 배열)
    const updated = exists ? [] : [date];
    
    setSelected(updated);
    onChange?.(updated);
  };

  // 이전/다음 달 이동
  const prev = () => {
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() - 1, 1));
  };
  const next = () => {
    setActiveStartDate(new Date(activeStartDate.getFullYear(), activeStartDate.getMonth() + 1, 1));
  };

  const handleConfirm = () => {
    onConfirm?.(selected);
  };
  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <div className="inline-block w-90 bg-white rounded-xl shadow-lg overflow-hidden pt-4 px-2.5">
      <DatePickerHeader current={activeStartDate} onPrev={prev} onNext={next} />
      <DatePickerBody
        activeStartDate={activeStartDate}
        selectedDates={selected}
        onChange={toggleDate}
        onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setActiveStartDate(activeStartDate)}
      />
      <DatePickerFooter onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
};

export default DatePicker;
