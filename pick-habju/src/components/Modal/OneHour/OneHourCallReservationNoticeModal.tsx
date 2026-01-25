import ModalOverlay from '../ModalOverlay';
import type { OneHourCallReservationNoticeModalProps } from './OneHourCallReservationNoticeModal.types';

const OneHourCallReservationNoticeModal = ({
  open = true,
  onClose,
  studioName,
  phoneNumber,
  onConfirm,
}: OneHourCallReservationNoticeModalProps) => {
  return (
    <ModalOverlay open={open} onClose={onClose} dimmedClassName="bg-black/80">
      <div className="w-full max-w-[25.9375rem] flex flex-col items-center">
        {/* 본문 카드 */}
        <div className="w-full max-w-[22.5rem] rounded-[0.5rem] bg-primary-white flex flex-col items-center gap-4 py-[2.25rem] px-[1.75rem]">
          {/* 1. 헤드 문구 (3줄) */}
          <div className="flex flex-col items-center gap-2 self-stretch">
            <div className="text-center font-modal-default text-primary-black">
              해당 합주실은 앞뒤로 예약이 있을 때<br></br>중간에 남은 1시간만{' '}
              <span className="text-blue-500 font-modal-default">전화</span>로 가능합니다.
            </div>
          </div>

          {/* 2. 합주실 이름 + 전화번호 (동적) */}
          <div className="w-full flex items-center justify-center gap-2">
            <span className="font-modal-call text-gray-400 text-center">[{studioName}]</span>
            <span className="font-modal-call text-gray-400 text-center">{phoneNumber}</span>
          </div>

          {/* 버튼 영역 */}
          <div className="flex w-full max-w-[18.375rem] justify-center items-center gap-3">
            {/* 다시 고를게요 */}
            <button
              type="button"
              onClick={onClose}
              className="flex w-[8.8125rem] h-[2.6875rem] p-[0.625rem] justify-center items-center gap-[0.75rem] flex-shrink-0 rounded-[0.625rem] border border-yellow-900 bg-primary-white text-yellow-900 hover:bg-yellow-900 hover:text-primary-white font-button transition"
            >
              다시 고를게요
            </button>
            {/* 문구만 확인해볼래요 (기존 예약할게요 버튼 스타일, 라벨만 변경) */}
            <button
              type="button"
              onClick={() => onConfirm?.()}
              className="flex w-[8.8125rem] h-[2.6875rem] px-[1.75rem] py-[0.75rem] justify-center items-center gap-[1.5rem] flex-shrink-0 rounded-[0.625rem] bg-yellow-900 text-primary-white hover:bg-yellow-700 font-button transition"
            >
              확인해볼래요
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default OneHourCallReservationNoticeModal;
