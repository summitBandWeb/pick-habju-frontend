export interface OneHourCallReservationNoticeModalProps {
  open?: boolean;
  onClose: () => void;
  studioName: string; // 예: 드림합주실 사당점
  phoneNumber: string; // 예: 02-1234-5678
  /** 링크 유지: 기존 예약할게요 버튼과 동일 스타일/동작, 라벨만 변경 */
  confirmHref?: string;
  /** 확인해볼래요 버튼 클릭 시 콜백 */
  onConfirm?: () => void;
}
