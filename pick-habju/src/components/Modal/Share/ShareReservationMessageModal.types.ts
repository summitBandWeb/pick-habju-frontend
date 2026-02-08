export interface ShareReservationMessageModalProps {
  open?: boolean;
  onClose: () => void;
  /** 공유하고 바로 예약하기 클릭 시 */
  onShare: () => void;
  /** 건너뛰고 예약하기 클릭 시 */
  onSkip: () => void;
}
