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
    openDatePicker: () => void;
    closeDatePicker: () => void;
    openTimePicker: () => void;
    closeTimePicker: () => void;
    reset: () => void;
  };
}
