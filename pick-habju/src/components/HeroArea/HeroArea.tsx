import { useCallback, useEffect, useState } from 'react';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import PersonCountInput from './Input/Person/PersonCountInput';
import DateTimeInput from './Input/Date/DateTimeInput';
import BackGroundImage from '../../assets/images/background.jpg';
import type { HeroAreaProps } from './HeroArea.types';
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [dateTimeText, setDateTimeText] = useState<string>(dateTime.label);
  const [peopleCountText, setPeopleCountText] = useState<number>(peopleCount);
  const [isSearchClickLocked, setIsSearchClickLocked] = useState<boolean>(false);
  const phase = useSearchStore((s) => s.phase);
  const isLoading = phase === SearchPhase.Loading;

  // GoogleForm Toast Store
  const { incrementSearchCount, showToast } = useGoogleFormToastStore();

  const [lastWarningKey, setLastWarningKey] = useState<string | null>(null);
  // TimePicker 임시 선택값 유지
  const [draftTime, setDraftTime] = useState<{
    startHour: number;
    startPeriod: TimePeriod;
    endHour: number;
    endPeriod: TimePeriod;
  } | null>(null);
  const { selectedDate, hourSlots } = useReservationState();
  const actions = useReservationActions();
  const isToastVisible = useToastStore((s) => s.isVisible);

  const openDatePicker = useCallback(() => {
    setIsDatePickerOpen(true);
  }, []);

  const openGuestCounter = useCallback(() => {
    setIsGuestModalOpen(true);
  }, []);

  const handleDateConfirm = useCallback(
    (dates: Date[]) => {
      actions.setDate(dates);
      setIsDatePickerOpen(false);
      // 타임피커 초기 포커스를 HeroArea의 현재 값으로 동기화
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
          setDraftTime({ startHour: s12.hour, startPeriod: s12.period, endHour: e12.hour, endPeriod: e12.period });
        }
      } catch {
        // 파싱 실패 시 무시하고 기본값 사용
      }
      setIsTimePickerOpen(true);
      setLastWarningKey(null);
      // 날짜 확정 시 기존 시간 임시값 유지 (변경 없음)
    },
    [actions, hourSlots, dateTime.hour_slots]
  );

  const handleDateCancel = useCallback(() => {
    setIsDatePickerOpen(false);
  }, []);

  {
    /*
    이거 굳이 heroArea에 있을 필요없어서 따로 분리해도 될듯
    SRP에 맞지않음. 따로 분리해서 사용하는게 좋을듯
    */
  }
  const validateTime = useCallback(
    (
      startHour: number,
      startPeriod: TimePeriod,
      endHour: number,
      endPeriod: TimePeriod
    ): ReservationToastKey | null => {
      const start24 = convertTo24Hour(startHour, startPeriod);
      const end24 = convertTo24Hour(endHour, endPeriod);

      // 기본 계산
      const adjustedEnd = end24 <= start24 ? end24 + 24 : end24;
      const duration = adjustedEnd - start24; // 시간 단위

      // 후보 판단
      const candidates: ReservationToastKey[] = [];

      // 형식 오류: 시작과 종료가 완전히 동일
      if (start24 === end24 && startPeriod === endPeriod) {
        candidates.push(ReservationToastKey.INVALID_TYPE);
      }

      // 5시간 초과
      if (duration > 5) {
        candidates.push(ReservationToastKey.TOO_LONG);
      }

      // 1시간 선택 (경고)
      if (duration === 1) {
        candidates.push(ReservationToastKey.TOO_SHORT);
      }

      // 과거 시간 (당일 시작 시간이 현재 이전)
      if (selectedDate) {
        const now = new Date();
        const isSameDay =
          selectedDate.getFullYear() === now.getFullYear() &&
          selectedDate.getMonth() === now.getMonth() &&
          selectedDate.getDate() === now.getDate();
        if (isSameDay) {
          // 정확한 시간 비교를 위해 Date 객체 생성 (분 단위까지 고려)
          const selectedDateTime = new Date(selectedDate);
          selectedDateTime.setHours(start24, 0, 0, 0); // 선택한 시간으로 설정

          if (now.getTime() > selectedDateTime.getTime()) {
            return ReservationToastKey.PAST_TIME;
          }
        }
      }

      if (candidates.length === 0) return null;

      // 우선순위: 에러 우선, 그 다음 경고. 에러 내부 우선순위 지정.
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
    [selectedDate]
  );

  // TODO: 이것도 중복되는 코드가 너무 많음 유틸성에도 있고. 따로 분리하고 관련흐름정리 한번 필요함
  const handleTimeConfirm = useCallback(
    (sh: number, sp: TimePeriod, eh: number, ep: TimePeriod) => {
      const key = validateTime(sh, sp, eh, ep);
      if (key) {
        const severity = ReservationToastSeverity[key];
        showToastByKey(key);
        if (severity === 'error') return;
        // warning인 경우: 첫 확인에서는 토스트만 띄우고 유지, 같은 선택으로 다시 확인 시 진행
        const dateKey = selectedDate ? selectedDate.toDateString() : 'no-date';
        const start24 = convertTo24Hour(sh, sp);
        const end24 = convertTo24Hour(eh, ep);
        const selectionKey = `${dateKey}|${start24}-${end24}`;
        if (lastWarningKey !== selectionKey) {
          setLastWarningKey(selectionKey);
          return; // 첫 경고: 모달 유지
        }
        // 동일 선택 재확인: 진행
      }
      actions.setHourSlots(sh, sp, eh, ep);
      setIsTimePickerOpen(false);

      if (selectedDate) {
        const dateIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
          selectedDate.getDate()
        ).padStart(2, '0')}`;
        const start24 = convertTo24Hour(sh, sp);
        const end24 = convertTo24Hour(eh, ep);
        const slots = generateHourSlots(start24, end24);
        setDateTimeText(formatReservationLabel(dateIso, slots));
      }

      // 날짜/시간 변경 여부를 직전 검색 조건과 비교하여 실제 변경 시에만 콜백 호출
      try {
        const last = useSearchStore.getState().lastQuery;
        if (selectedDate) {
          const dateIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
            selectedDate.getDate()
          ).padStart(2, '0')}`;
          const start24 = convertTo24Hour(sh, sp);
          const end24 = convertTo24Hour(eh, ep);
          const nextSlots = generateHourSlots(start24, end24);

          const isSameDate = last?.date === dateIso;
          const isSameSlots =
            Array.isArray(last?.hour_slots) &&
            last!.hour_slots.length === nextSlots.length &&
            last!.hour_slots.every((v, i) => v === nextSlots[i]);

          if (!(isSameDate && isSameSlots)) {
            onDateTimeChange?.();
          }
        }
      } catch {
        // 비교 실패 시 콜백 생략
      }
    },
    [actions, validateTime, selectedDate, lastWarningKey, onDateTimeChange]
  );

  const handleTimeCancel = useCallback(() => {
    // 뒤로가기: TimePicker를 닫고 DatePicker로 복귀, 기존 날짜 유지
    setIsTimePickerOpen(false);
    setIsDatePickerOpen(true);
  }, []);

  // 오버레이 바깥 클릭으로 모달 닫기
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setIsDatePickerOpen(false);
    setIsTimePickerOpen(false);
    setIsGuestModalOpen(false);
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!(isDatePickerOpen || isTimePickerOpen || isGuestModalOpen)) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsDatePickerOpen(false);
        setIsTimePickerOpen(false);
        setIsGuestModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDatePickerOpen, isTimePickerOpen, isGuestModalOpen]);

  // 모달 열렸을 때 배경 스크롤 잠금
  useEffect(() => {
    const anyOpen = isDatePickerOpen || isTimePickerOpen || isGuestModalOpen;
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
  }, [isDatePickerOpen, isTimePickerOpen, isGuestModalOpen]);

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
            <DateTimeInput dateTime={dateTimeText} onChangeClick={openDatePicker} />
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

      {(isDatePickerOpen || isTimePickerOpen || isGuestModalOpen) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80" onClick={handleOverlayClick}>
          {/* wrapper 기준 폭으로 중앙 정렬 */}
          <div className="relative w-full max-w-[25.9375rem] flex flex-col items-center">
            {isDatePickerOpen && (
              <DatePicker
                onConfirm={handleDateConfirm}
                onCancel={handleDateCancel}
                initialSelectedDate={selectedDate ?? undefined}
              />
            )}
            {isTimePickerOpen && (
              <TimePicker
                onConfirm={handleTimeConfirm}
                onCancel={handleTimeCancel}
                disabled={isToastVisible}
                onDraftChange={(sh, sp, eh, ep) =>
                  setDraftTime({ startHour: sh, startPeriod: sp, endHour: eh, endPeriod: ep })
                }
                initialStartHour={draftTime?.startHour}
                initialStartPeriod={draftTime?.startPeriod}
                initialEndHour={draftTime?.endHour}
                initialEndPeriod={draftTime?.endPeriod}
              />
            )}
            {isGuestModalOpen && (
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
            )}
            {/* 모달 아래 토스트 (모달 위치 고정, 토스트는 절대 배치) */}
            <div className="absolute top-full mt-3 left-0 w-full flex justify-center">
              <ToastMessage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroArea;
