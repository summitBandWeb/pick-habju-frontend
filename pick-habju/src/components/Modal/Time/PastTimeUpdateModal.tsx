import { useEffect, useMemo, useRef, useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import Button from '../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../Button/ButtonEnums';
import { useSearchStore } from '../../../store/search/searchStore';
import { SearchPhase } from '../../../store/search/searchStore.types';
import { useReservationActions, useReservationState } from '../../../hook/useReservationStore';

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
  const { formattedDate, hourSlots } = useReservationState();

  const startDateTime = useMemo(() => {
    try {
      // 1) 사용자가 선택한 값이 있으면(검색 전 포함) 그 값을 기준으로 감지
      if (formattedDate && Array.isArray(hourSlots) && hourSlots.length > 0) {
        return new Date(`${formattedDate}T${hourSlots[0]}`);
      }

      // 2) 선택값이 없고 Default 상태라면 직전 검색 조건을 기준으로 감지
      if (
        phase === SearchPhase.Default &&
        lastQuery &&
        Array.isArray(lastQuery.hour_slots) &&
        lastQuery.hour_slots.length > 0
      ) {
        return new Date(`${lastQuery.date}T${lastQuery.hour_slots[0]}`);
      }
    } catch {
      // fallthrough
    }
    return null;
  }, [formattedDate, hourSlots, phase, lastQuery]);

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
