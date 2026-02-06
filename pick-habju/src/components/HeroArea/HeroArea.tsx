import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import PersonCountInput from './Input/Person/PersonCountInput';
import DateTimeInputDropdown from './Input/Date/DateTimeInputDropdown';
import BackGroundImage from '../../assets/images/background.jpg';
import type { HeroAreaProps } from './HeroArea.types';
import GuestCounterModal from '../GuestCounterModal/GuestCounterModal';
import { TimePeriod } from '../TimePicker/TimePickerEnums';
import { showToastByKey } from '../../utils/showToastByKey';
import { ReservationToastKey, ReservationToastSeverity } from '../ToastMessage/ToastMessageEnums';
import ToastMessage from '../ToastMessage/ToastMessage';
import { useReservationActions, useReservationState } from '../../hook/useReservationStore';
import { convertTo24Hour } from '../../utils/formatDate';
import { useToastStore } from '../../store/toast/toastStore';
import { formatReservationLabel } from '../../utils/formatReservationLabel';
import { generateHourSlots } from '../../utils/formatTime';
import { useSearchStore } from '../../store/search/searchStore';
import { SearchPhase } from '../../store/search/searchStore.types';
import { trackSearchButtonClick } from '../../utils/analytics';
import { useGoogleFormToastStore } from '../../store/googleFormToast/googleFormToastStore';
import { useAnalyticsCycleStore } from '../../store/analytics/analyticsStore';

const HeroArea = ({ dateTime, peopleCount, onDateTimeChange, onPersonCountChange, onSearch }: HeroAreaProps) => {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [dateTimeText, setDateTimeText] = useState<string>(dateTime.label);
  const [peopleCountText, setPeopleCountText] = useState<number>(peopleCount);
  const [isSearchClickLocked, setIsSearchClickLocked] = useState<boolean>(false);
  const phase = useSearchStore((s) => s.phase);
  const isLoading = phase === SearchPhase.Loading;

  // GoogleForm Toast Store
  const { incrementSearchCount, showToast } = useGoogleFormToastStore();

  const [lastWarningKey, setLastWarningKey] = useState<string | null>(null);
  const { selectedDate, hourSlots } = useReservationState();
  const actions = useReservationActions();
  const isToastVisible = useToastStore((s) => s.isVisible);

  const openGuestCounter = useCallback(() => {
    setIsGuestModalOpen(true);
  }, []);

  {
    /*
    이거 굳이 heroArea에 있을 필요없어서 따로 분리해도 될듯
    SRP에 맞지않음. 따로 분리해서 사용하는게 좋을듯
    */
  }
  const validateTime = useCallback(
    (
      date: Date | null,
      startHour: number,
      startPeriod: TimePeriod,
      endHour: number,
      endPeriod: TimePeriod
    ): ReservationToastKey | null => {
      const start24 = convertTo24Hour(startHour, startPeriod);
      const end24 = convertTo24Hour(endHour, endPeriod);

      const adjustedEnd = end24 <= start24 ? end24 + 24 : end24;
      const duration = adjustedEnd - start24;

      const candidates: ReservationToastKey[] = [];

      if (start24 === end24 && startPeriod === endPeriod) {
        candidates.push(ReservationToastKey.INVALID_TYPE);
      }
      if (duration > 5) {
        candidates.push(ReservationToastKey.TOO_LONG);
      }
      if (duration === 1) {
        candidates.push(ReservationToastKey.TOO_SHORT);
      }
      if (date) {
        const now = new Date();
        const isSameDay =
          date.getFullYear() === now.getFullYear() &&
          date.getMonth() === now.getMonth() &&
          date.getDate() === now.getDate();
        if (isSameDay) {
          const selectedDateTime = new Date(date);
          selectedDateTime.setHours(start24, 0, 0, 0);
          if (now.getTime() > selectedDateTime.getTime()) {
            return ReservationToastKey.PAST_TIME;
          }
        }
      }

      if (candidates.length === 0) return null;

      const errorPriority: ReservationToastKey[] = [
        ReservationToastKey.INVALID_TYPE,
        ReservationToastKey.PAST_TIME,
        ReservationToastKey.TOO_LONG,
      ];
      const warningPriority: ReservationToastKey[] = [ReservationToastKey.TOO_SHORT];
      const error = errorPriority.find((k) => candidates.includes(k));
      if (error) return error;
      const warning = warningPriority.find((k) => candidates.includes(k));
      return warning ?? null;
    },
    []
  );

  const handleDateTimeConfirm = useCallback(
    (date: Date, sh: number, sp: TimePeriod, eh: number, ep: TimePeriod): boolean => {
      const key = validateTime(date, sh, sp, eh, ep);
      if (key) {
        const severity = ReservationToastSeverity[key];
        showToastByKey(key);
        if (severity === 'error') return false;
        const dateKey = date.toDateString();
        const start24 = convertTo24Hour(sh, sp);
        const end24 = convertTo24Hour(eh, ep);
        const selectionKey = `${dateKey}|${start24}-${end24}`;
        if (lastWarningKey !== selectionKey) {
          setLastWarningKey(selectionKey);
          return false;
        }
      }
      actions.setDate([date]);
      actions.setHourSlots(sh, sp, eh, ep);
      setLastWarningKey(null);

      const dateIso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const start24 = convertTo24Hour(sh, sp);
      const end24 = convertTo24Hour(eh, ep);
      const slots = generateHourSlots(start24, end24);
      setDateTimeText(formatReservationLabel(dateIso, slots));

      try {
        const last = useSearchStore.getState().lastQuery;
        const nextSlots = generateHourSlots(start24, end24);
        const isSameDate = last?.date === dateIso;
        const isSameSlots =
          Array.isArray(last?.hour_slots) &&
          last!.hour_slots.length === nextSlots.length &&
          last!.hour_slots.every((v, i) => v === nextSlots[i]);
        if (!(isSameDate && isSameSlots)) {
          onDateTimeChange?.();
        }
      } catch {
        /* 비교 실패 시 콜백 생략 */
      }
      return true;
    },
    [actions, validateTime, lastWarningKey, onDateTimeChange]
  );

  const initialTimeFromSlots = useMemo(() => {
    try {
      const slots = hourSlots && hourSlots.length > 0 ? hourSlots : dateTime.hour_slots;
      if (Array.isArray(slots) && slots.length > 0) {
        const parseHour = (hhmm: string): number => {
          const h = parseInt(hhmm.split(':')[0], 10);
          return isNaN(h) ? 9 : h;
        };
        const start24 = parseHour(slots[0]);
        const end24 = (start24 + slots.length) % 24;
        const to12 = (h24: number): { hour: number; period: TimePeriod } => {
          if (h24 === 0) return { hour: 12, period: TimePeriod.AM };
          if (h24 < 12) return { hour: h24, period: TimePeriod.AM };
          if (h24 === 12) return { hour: 12, period: TimePeriod.PM };
          return { hour: h24 - 12, period: TimePeriod.PM };
        };
        const s12 = to12(start24);
        const e12 = to12(end24 === 0 ? 24 % 24 : end24);
        return { startHour: s12.hour, startPeriod: s12.period, endHour: e12.hour, endPeriod: e12.period };
      }
    } catch {
      /* 파싱 실패 */
    }
    return {
      startHour: 9,
      startPeriod: TimePeriod.AM,
      endHour: 5,
      endPeriod: TimePeriod.PM,
    };
  }, [hourSlots, dateTime.hour_slots]);

  // 오버레이 바깥 클릭으로 모달 닫기
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setIsGuestModalOpen(false);
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isGuestModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsGuestModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isGuestModalOpen]);

  // 모달 열렸을 때 배경 스크롤 잠금
  useEffect(() => {
    const anyOpen = isGuestModalOpen;
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = (document.body.style as unknown as { touchAction?: string }).touchAction;
    if (anyOpen) {
      document.body.style.overflow = 'hidden';
      (document.body.style as unknown as { touchAction?: string }).touchAction = 'none';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      if (originalTouchAction !== undefined) {
        (document.body.style as unknown as { touchAction?: string }).touchAction = originalTouchAction;
      } else {
        (document.body.style as unknown as { touchAction?: string }).touchAction = '';
      }
    };
  }, [isGuestModalOpen]);

  return (
    <div
      className="relative w-full h-97.5 flex flex-col items-center"
      style={{
        backgroundImage: `url(${BackGroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* 오버레이 레이어 */}
      <div className="absolute inset-0 bg-primary-black opacity-50 z-0" />

      {/* 실제 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-primary-white font-hero-headline mt-15.5 mb-8">합주실 예약 현황을 한눈에</h1>

        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-3 mb-8">
            <DateTimeInputDropdown
              dateTime={dateTimeText}
              initialSelectedDate={selectedDate ?? undefined}
              onConfirm={handleDateTimeConfirm}
              disabled={isToastVisible}
              initialStartHour={initialTimeFromSlots.startHour}
              initialStartPeriod={initialTimeFromSlots.startPeriod}
              initialEndHour={initialTimeFromSlots.endHour}
              initialEndPeriod={initialTimeFromSlots.endPeriod}
            />
            <PersonCountInput count={peopleCountText} onChangeClick={openGuestCounter} />
          </div>
          <div>
            <Button
              label="검색하기"
              onClick={() => {
                if (isLoading || isSearchClickLocked) return;
                setIsSearchClickLocked(true);
                setTimeout(() => setIsSearchClickLocked(false), 600);

                // 스토어에 값이 없으면 props의 기본값 사용
                let dateIso: string;
                let slots: string[];

                if (selectedDate) {
                  dateIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
                    selectedDate.getDate()
                  ).padStart(2, '0')}`;
                } else {
                  dateIso = dateTime.date;
                }

                if (hourSlots && hourSlots.length > 0) {
                  slots = hourSlots;
                } else {
                  slots = dateTime.hour_slots;
                }

                // 직전 사이클 요약 전송 및 새 사이클 시작
                try {
                  useAnalyticsCycleStore.getState().endCycleAndFlush({
                    date: dateIso,
                    hour_slots: slots,
                    people_count: peopleCountText,
                  });
                } catch (e) {
                  console.debug('endCycleAndFlush failed', e);
                }

                // 검색 횟수 증가 및 토스트 표시 조건 확인
                incrementSearchCount();
                showToast();

                // 검색 버튼 클릭 이벤트를 GA에 추적
                trackSearchButtonClick({
                  date: dateIso,
                  hour_slots: slots,
                  peopleCount: peopleCountText,
                });

                // UI 라벨 업데이트 보정
                setDateTimeText(formatReservationLabel(dateIso, slots));
                onSearch({ date: dateIso, hour_slots: slots, peopleCount: peopleCountText });
              }}
              variant={ButtonVariant.Main}
              size={BtnSizeVariant.MD}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {isGuestModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80" onClick={handleOverlayClick}>
          <div className="relative w-full max-w-[25.9375rem] flex flex-col items-center">
            <GuestCounterModal
                open
                onClose={() => setIsGuestModalOpen(false)}
                onConfirm={(val) => {
                  setPeopleCountText(val);
                  setIsGuestModalOpen(false);
                  try {
                    const last = useSearchStore.getState().lastQuery;
                    if (typeof last?.peopleCount === 'number' && last.peopleCount !== val) {
                      onPersonCountChange?.();
                    }
                  } catch {
                    // 비교 실패 시 콜백 생략
                  }
                }}
                initialCount={peopleCountText}
            />
          </div>
        </div>
      )}

      {/* 토스트 (드롭다운/모달 검증용, 항상 마운트) */}
      <div className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <ToastMessage />
      </div>
    </div>
  );
};

export default HeroArea;
