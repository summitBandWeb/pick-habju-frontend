import ChatImg from '../../../assets/svg/ChatImg.svg';
import Button from '../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../Button/ButtonEnums';
import ModalOverlay from '../ModalOverlay';
import type { ShareReservationMessageModalProps } from './ShareReservationMessageModal.types';

const ShareReservationMessageModal = ({
  open = true,
  onClose,
  onShare,
  onSkip,
}: ShareReservationMessageModalProps) => {
  return (
    <ModalOverlay open={open} onClose={onClose} dimmedClassName="bg-black/80">
      <div className="w-full max-w-[25.9375rem] flex flex-col items-center">
        <div className="w-full max-w-[22.5rem] rounded-[0.5rem] bg-primary-white flex flex-col items-center gap-4 py-7 px-7">
          {/* 헤더: 제목 + 3 of 3 */}
          <div className="flex w-full justify-between items-start">
            <h2 className="flex-1 font-modal-default text-primary-black">
              번거로운 일정 공유,
              <br />
              픽합주가 대신 해드립니다!
            </h2>
            <span className="text-gray-300 font-button">3 of 3</span>
          </div>

          {/* 디바이더 */}
          <div className="w-full h-px bg-gray-100" />

          {/* 채팅 이미지 */}
          <img src={ChatImg} alt="예약 공유 채팅" className="w-full max-w-[18rem] pb-[8px]" />

          {/* 버튼 영역 (세로 배치) */}
          <div className="flex w-full max-w-[18.375rem] flex-col items-center gap-1.5">
            <Button
              label="공유하고 바로 예약하기"
              variant={ButtonVariant.Main}
              size={BtnSizeVariant.LG}
              onClick={() => onShare?.()}
              className="w-full text-primary-white hover:text-primary-white"
            />
            <Button
              label="건너뛰고 예약하기"
              variant={ButtonVariant.Ghost}
              size={BtnSizeVariant.LG}
              onClick={() => onSkip?.()}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ShareReservationMessageModal;
