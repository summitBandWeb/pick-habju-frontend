export interface ToastState {
  message: string | null;
  isVisible: boolean;
  showToast: (message: string) => void;
  hideToast: () => void;
}
