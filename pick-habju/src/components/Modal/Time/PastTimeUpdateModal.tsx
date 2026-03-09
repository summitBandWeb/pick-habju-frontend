import { useEffect, useMemo, useRef, useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import Button from '../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../Button/ButtonEnums';
import { useReservationActions, useReservationState } from '../../../hook/useReservationStore';

type PastTimeUpdateModalProps = {
  onConfirm: () => void;
};

// 시작 시간이 현재 시각을 지나는 순간을 감지하여 모달을 띄운다
const PastTimeUpdateModal = ({ onConfirm }: PastTimeUpdateModalProps) => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const { formattedDate, hourSlots } = useReservationState();
  const reservationActions = useReservationActions();

  const startDateTime = useMemo(() => {
    if (formattedDate && Array.isArray(hourSlots) && hourSlots.length > 0) {
      return new Date(`${formattedDate}T${hourSlots[0]}`);
    }
    return null;
  }, [formattedDate, hourSlots]);

  useEffect(() => {
    if (!startDateTime || Number.isNaN(startDateTime.getTime())) {
      setOpen(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }

    const due = startDateTime.getTime();
    const MAX_TIMEOUT_MS = 2147483647 - 1000; // 약 24.8일, 안전 마진

    const schedule = () => {
      const now = Date.now();
      if (now >= due) {
        setOpen(true);
        return;
      }
      const remaining = due - now;
      const nextDelay = Math.min(remaining, MAX_TIMEOUT_MS);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(schedule, nextDelay);
    };

    schedule();

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [startDateTime]);

  return (
    <ModalOverlay
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <div className="w-[22.5rem] bg-white rounded-2xl shadow-lg p-7 flex flex-col justify-center items-center gap-3">
        <div className="text-gray-400 text-center text-sm font-semibold leading-normal">
          앗, 검색 도중 시간이 지나 예약이 어려워졌어요!
        </div>
        <div className="text-gray-900 text-center text-base font-bold leading-6">다른 시간으로 다시 찾아볼까요?</div>
        <div className="flex justify-center items-center w-[18.375rem]">
          <Button
            label="네, 검색할게요"
            onClick={() => {
              reservationActions.reset();
              setOpen(false);
              onConfirm();
            }}
            variant={ButtonVariant.Main}
            size={BtnSizeVariant.MD}
            className="rounded-[0.625rem] bg-yellow-900 hover:bg-yellow-700 text-primary-white px-[1.75rem] py-[0.75rem] flex justify-center items-center gap-[1.5rem] flex-[1_0_0]"
          />
        </div>
      </div>
    </ModalOverlay>
  );
};

export default PastTimeUpdateModal;
