export interface PickerFooterProps {
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
  cancelText?: string;
}
