import ModalOverlay from '../ModalOverlay';
import type { PartialReservationConfirmModalProps } from './PartialReservationConfirmModal.types';

const PartialReservationConfirmModal = ({
  open = true,
  onClose,
  availableTime,
  onConfirm,
}: PartialReservationConfirmModalProps) => {
  return (
    <ModalOverlay open={open} onClose={onClose} dimmedClassName="bg-black/80">
      <div className="w-full max-w-[25.9375rem] flex flex-col items-center">
        {/* 본문 카드 */}
        <div className="w-full max-w-[22.5rem] rounded-[0.5rem] bg-primary-white flex flex-col items-center gap-4 py-[2.25rem] px-[1.75rem]">
          {/* 1. 헤드 문구 */}
          <div className="flex flex-col items-center gap-4 self-stretch">
            <div className="text-center font-modal-default text-primary-black">
              앗, 선택한 시간 중 일부는 이미 예약됐어요!
            </div>
            {/* 2. 가능한 시간 (동적) */}
            <div className="self-stretch text-center font-modal-default text-blue-500">
              [가능한 시간] {availableTime}
            </div>
            {/* 3. 질문 문구 */}
            <div className="w-[18.5rem] h-[1.5rem] text-center font-modal-default text-primary-black">
              이대로 가능한지 확인해 보시겠어요?
            </div>
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
            {/* 예약할게요 */}
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

export default PartialReservationConfirmModal;
