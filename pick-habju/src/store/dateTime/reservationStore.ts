import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ReservationStoreState } from './reservationStore.types';
import { convertTo24Hour, formatDate } from '../../utils/formatDate';
import { generateHourSlots } from '../../utils/formatTime';

const initialState = {
  selectedDate: null,
  formattedDate: null,
  hourSlots: [],
  isDatePickerOpen: false,
  isTimePickerOpen: false,
};

const useReservationStore = create<ReservationStoreState>()(
  devtools(
    immer((set) => ({
      ...initialState,
      actions: {
        setDate: (dates) =>
          set((state) => {
            const newDate = dates[0] ?? null;
            state.selectedDate = newDate;
            state.formattedDate = formatDate(newDate);
          }),
        setHourSlots: (sh, sp, eh, ep) =>
          set((state) => {
            const start24 = convertTo24Hour(sh, sp);
            const end24 = convertTo24Hour(eh, ep);
            state.hourSlots = generateHourSlots(start24, end24);
          }),

        openDatePicker: () =>
          set((state) => {
            state.isDatePickerOpen = true;
          }),
        closeDatePicker: () =>
          set((state) => {
            state.isDatePickerOpen = false;
          }),
        openTimePicker: () =>
          set((state) => {
            state.isTimePickerOpen = true;
          }),
        closeTimePicker: () =>
          set((state) => {
            state.isTimePickerOpen = false;
          }),
        reset: () => set(initialState),
      },
    }))
  )
);

export default useReservationStore;
