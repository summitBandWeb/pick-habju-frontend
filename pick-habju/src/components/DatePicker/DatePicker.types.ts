export interface DatePickerProps {
  /* 초기 선택된 날짜 (단일 선택) */
  initialSelectedDate?: Date;
  /* 날짜 선택 시 호출되는 콜백 */
  onChange?: (dates: Date[]) => void;
}
