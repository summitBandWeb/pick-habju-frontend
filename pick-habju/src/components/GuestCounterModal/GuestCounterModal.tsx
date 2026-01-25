import { useEffect, useState } from 'react';
import GuestCounter from './GuestCounter/GuestCounter';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import type { GuestCounterModalProps } from './GuestCounterModal.types';
import ModalOverlay from '../Modal/ModalOverlay';

const GuestCounterModal = ({ open = true, onClose, onConfirm, initialCount = 12 }: GuestCounterModalProps) => {
  const [guestCount, setGuestCount] = useState(initialCount);

  useEffect(() => {
    if (open) {
      setGuestCount(initialCount);
    }
  }, [open, initialCount]);

  return (
    <ModalOverlay open={open} onClose={onClose}>
      <div className="w-90 h-64 bg-primary-white rounded-lg gap-10 py-7 px-15 flex flex-col justify-center items-center">
        {/* 제목 */}
        <div className="font-modal-default text-primary-black">합주실 이용 인원을 입력해주세요</div>

        {/* 인원 수 카운터 */}
        <GuestCounter value={guestCount} onChange={setGuestCount} min={1} max={30} />

        {/* 확인 버튼 */}
        <div>
          <Button
            label="확인"
            variant={ButtonVariant.Main}
            size={BtnSizeVariant.SM}
            onClick={() => {
              onConfirm(guestCount);
              onClose();
            }}
          />
        </div>
      </div>
    </ModalOverlay>
  );
};

export default GuestCounterModal;
