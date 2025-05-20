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
