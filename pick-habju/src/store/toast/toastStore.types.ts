import type { ToastSeverity } from '../../components/ToastMessage/ToastMessageEnums';

export interface ToastState {
  message: string | null;
  severity: ToastSeverity;
  isVisible: boolean;
  showToast: (message: string, severity?: ToastSeverity) => void;
  showPersistentToast: (message: string, severity?: ToastSeverity) => void;
  hideToast: () => void;
}
