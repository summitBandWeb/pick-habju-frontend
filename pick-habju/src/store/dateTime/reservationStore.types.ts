import type { TimePeriod } from '../../components/TimePicker/TimePickerEnums';

export interface ReservationStoreState {
  selectedDate: Date | null;
  formattedDate: string | null;
  hourSlots: string[];
  isDatePickerOpen: boolean;
  isTimePickerOpen: boolean;
  actions: {
    setDate: (dates: Date[]) => void;
    setHourSlots: (sh: number, sp: TimePeriod, eh: number, ep: TimePeriod) => void;
    /** 'HH:00' 형식의 슬롯 배열을 그대로 store에 세팅 (lastQuery 복원용) */
    setHourSlotsRaw: (slots: string[]) => void;
    openDatePicker: () => void;
    closeDatePicker: () => void;
    openTimePicker: () => void;
    closeTimePicker: () => void;
    reset: () => void;
  };
}
