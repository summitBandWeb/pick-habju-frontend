import { useEffect, useState } from 'react';
import GuestCounter from './GuestCounter/GuestCounter';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import type { GuestCounterModalProps } from './GuestCounterModal.types';

const GuestCounterModal = ({ open, onClose, onConfirm, initialCount = 12 }: GuestCounterModalProps) => {
  const [guestCount, setGuestCount] = useState(initialCount);

  useEffect(() => {
    if (open) {
      setGuestCount(initialCount);
    }
  }, [open, initialCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  // 추가할만한 기능 : 바깥 클릭 시에 Modal 창 닫기

  return (
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
  );
};

export default GuestCounterModal;
