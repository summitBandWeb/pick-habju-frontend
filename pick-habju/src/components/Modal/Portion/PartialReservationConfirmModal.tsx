import Button from '../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../Button/ButtonEnums';
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
            <Button
              label="다시 고를게요"
              variant={ButtonVariant.Ghost}
              size={BtnSizeVariant.XSM}
              onClick={onClose}
              className="flex-1 min-w-0"
            />
            <Button
              label="확인해볼래요"
              variant={ButtonVariant.Main}
              size={BtnSizeVariant.XSM}
              onClick={() => onConfirm?.()}
              className="flex-1 min-w-0 text-primary-white hover:text-primary-white"
            />
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default PartialReservationConfirmModal;
