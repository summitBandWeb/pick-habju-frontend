import { ReservationToastMessages, type ReservationToastKey } from '../components/ToastMessage/ToastMessageEnums';
import { useToastStore } from '../store/toast/toastStore';

export const showToastByKey = (key: ReservationToastKey) => {
  const { showToast } = useToastStore.getState();
  const message = ReservationToastMessages[key];
  showToast(message);
};
