import { useEffect, useMemo, useRef, useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import Button from '../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../Button/ButtonEnums';
import { useSearchStore } from '../../../store/search/searchStore';
import { SearchPhase } from '../../../store/search/searchStore.types';
import { useReservationActions } from '../../../hook/useReservationStore';

type PastTimeUpdateModalProps = {
  onHeroReset: () => void;
};

// 검색 결과(Default) 상태에서, 시작 시간이 현재 시각을 지나는 순간을 감지하여 모달을 띄운다
const PastTimeUpdateModal = ({ onHeroReset }: PastTimeUpdateModalProps) => {
  const phase = useSearchStore((s) => s.phase);
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const setPhase = useSearchStore((s) => s.setPhase);
  const reservationActions = useReservationActions();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startDateTime = useMemo(() => {
    if (!lastQuery || !Array.isArray(lastQuery.hour_slots) || lastQuery.hour_slots.length === 0) return null;
    const first = lastQuery.hour_slots[0];
    try {
      return new Date(`${lastQuery.date}T${first}`);
    } catch {
      return null;
    }
  }, [lastQuery]);

  useEffect(() => {
    // Default 상태에서만 감지
    if (phase !== SearchPhase.Default || !startDateTime) {
      setOpen(false);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      return;
    }

    const now = Date.now();
    const due = startDateTime.getTime();
    if (now >= due) {
      setOpen(true);
      return;
    }

    const delay = Math.max(0, due - now);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
    }, delay);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [phase, startDateTime]);

  if (!open) return null;

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
        <div className="text-gray-900 text-center text-base font-bold leading-6">
          다른 시간으로 다시 찾아볼까요?
        </div>
        <div className="flex justify-center items-center w-[18.375rem]">
          <Button
            label="네, 검색할게요"
            onClick={() => {
              // 상태 초기화 및 HeroArea 기본값 재계산을 유도
              reservationActions.reset();
              setPhase(SearchPhase.BeforeSearch);
              onHeroReset();
              setOpen(false);
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
