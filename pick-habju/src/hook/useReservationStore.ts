import { useShallow } from 'zustand/shallow';
import useReservationStore from '../store/dateTime/reservationStore'; // 경로는 실제 프로젝트에 맞게 수정해주세요.

// 모든 데이터 관련 상태 값을 한번에 가져오는 훅
export const useReservationState = () =>
  useReservationStore(
    useShallow((state) => ({
      selectedDate: state.selectedDate,
      formattedDate: state.formattedDate,
      hourSlots: state.hourSlots,
    }))
  );

// 백엔드 전송용 최종 데이터를 조합해서 반환하는 훅
export const useReservationPayload = () =>
  useReservationStore(
    useShallow((state) => {
      if (!state.formattedDate || state.hourSlots.length === 0) {
        return null;
      }
      return {
        date: state.formattedDate,
        hour_slots: state.hourSlots,
      };
    })
  );

// DatePicker의 열림/닫힘 상태만 가져오는 훅
export const useIsDatePickerOpen = () => useReservationStore((state) => state.isDatePickerOpen);

// TimePicker의 열림/닫힘 상태만 가져오는 훅
export const useIsTimePickerOpen = () => useReservationStore((state) => state.isTimePickerOpen);

// 모든 액션을 한번에 가져오는 훅
export const useReservationActions = () => useReservationStore((state) => state.actions);
