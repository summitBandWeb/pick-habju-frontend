export interface CallReservationNoticeModalProps {
  open?: boolean;
  onClose: () => void;
  studioName: string; // 합주실 이름 (예: 드림합주실 사당점)
  phoneNumber: string; // 전화번호 (예: 02-1234-5678)
}
