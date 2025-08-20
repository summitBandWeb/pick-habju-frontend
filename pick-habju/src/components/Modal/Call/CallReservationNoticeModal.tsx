import { useEffect } from 'react';
import type { CallReservationNoticeModalProps } from './CallReservationNoticeModal.types';

const CallReservationNoticeModal = ({ open, onClose, studioName, phoneNumber }: CallReservationNoticeModalProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // 주의: 이 모달은 부모에서 `ModalOverlay`로 감싼 상태에서 사용됩니다.
  // 배경(오버레이) 클릭/ESC 닫기는 부모 `ModalOverlay`가 처리하므로,
  // 여기서는 콘텐츠만 렌더링합니다.
  return (
    <div className="w-full max-w-[25.9375rem] flex flex-col items-center">
      <div className="w-[22.5rem] rounded-[0.5rem] bg-primary-white flex flex-col items-end gap-3 py-[3.5rem] px-[1.75rem]">
        {/* 1. 안내 문구 */}
        <div className="w-full text-center font-modal-default text-primary-black">
          해당 합주실의 당일 예약은{' '}<br></br>
          <span className="text-blue-500 font-modal-default">전화</span>
          로만 가능합니다.
        </div>

        {/* 2. 합주실 이름 + 전화번호 (동적) */}
        <div className="w-full flex items-center justify-center gap-2">
          <span className="font-modal-call text-gray-400 text-center">[{studioName}]</span>
          <span className="font-modal-call text-gray-400 text-center">{phoneNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default CallReservationNoticeModal;
