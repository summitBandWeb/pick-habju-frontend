export interface GuestCounterModalProps {
  open?: boolean;
  onClose: () => void;
  onConfirm: (guestCount: number) => void;
  initialCount?: number;
}
