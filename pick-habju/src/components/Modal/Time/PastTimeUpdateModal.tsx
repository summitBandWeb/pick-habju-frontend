import { useEffect, useMemo, useRef, useState } from 'react';
import ModalOverlay from '../ModalOverlay';
import Button from '../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../Button/ButtonEnums';
import { useSearchStore } from '../../../store/search/searchStore';
import { SearchPhase } from '../../../store/search/searchStore.types';
import { useReservationActions, useReservationState } from '../../../hook/useReservationStore';
import { useDefaultDateTime } from '../../../hook/useDefaultDateTime';

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
  const { defaultDateIso, defaultSlots } = useDefaultDateTime();

  const startDateTime = useMemo(() => {
    try {
      // 1) 검색 결과(Default) 화면에서는 직전 검색 조건을 기준으로 모니터링
      if (
        phase === SearchPhase.Default &&
        lastQuery &&
        Array.isArray(lastQuery.hour_slots) &&
        lastQuery.hour_slots.length > 0
      ) {
        return new Date(`${lastQuery.date}T${lastQuery.hour_slots[0]}`);
      }

      // 2) 사용자가 날짜/시간을 선택해 둔 경우(아직 검색 전), 해당 선택값을 기준으로 모니터링
      if (formattedDate && Array.isArray(hourSlots) && hourSlots.length > 0) {
        return new Date(`${formattedDate}T${hourSlots[0]}`);
      }

      // 3) 그 외(첫 방문 등)에는 HeroArea가 초기 표시하는 기본값을 기준으로 모니터링
      if (defaultDateIso && Array.isArray(defaultSlots) && defaultSlots.length > 0) {
        return new Date(`${defaultDateIso}T${defaultSlots[0]}`);
      }
    } catch {
      // fallthrough
    }
    return null;
  }, [phase, lastQuery, formattedDate, hourSlots, defaultDateIso, defaultSlots]);

  useEffect(() => {
    if (!startDateTime) {
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
  }, [startDateTime]);

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
