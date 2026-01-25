export interface PartialReservationConfirmModalProps {
  open?: boolean;
  onClose: () => void;
  /** 예: "15:00 - 17:00" */
  availableTime: string;
  /** 미지정 시 기본값으로 구글 링크 사용 */
  confirmHref?: string;
  /** 예약할게요 버튼 클릭 시 콜백 */
  onConfirm?: () => void;
}
