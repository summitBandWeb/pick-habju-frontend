import { useCallback, useState } from 'react';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import PersonCountInput from './Input/Person/PersonCountInput';
import DateTimeInput from './Input/\bDate/DateTimeInput';
import BackGroundImage from '../../assets/images/background.jpg';
import type { HeroAreaProps } from './HeroArea.types';
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import GuestCounterModal from '../GuestCounterModal/GuestCounterModal';
import { TimePeriod } from '../TimePicker/TimePickerEnums';
import ToastMessage from '../ToastMessage/ToastMessage';
import { showToastByKey } from '../../utils/showToastByKey';
import { ReservationToastKey } from '../ToastMessage/ToastMessageEnums';
import { useReservationActions, useReservationState } from '../../hook/useReservationStore';
import { convertTo24Hour } from '../../utils/formatDate';
import { useToastStore } from '../../store/toast/toastStore';
import { formatReservationLabel } from '../../utils/formatReservationLabel';
import { generateHourSlots } from '../../utils/formatTime';

const HeroArea = ({ dateTime, peopleCount, onDateTimeChange, onPersonCountChange, onSearch }: HeroAreaProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [dateTimeText, setDateTimeText] = useState<string>(dateTime.label);
  const [peopleCountText, setPeopleCountText] = useState<number>(peopleCount);
  const { selectedDate, hourSlots } = useReservationState();
  const actions = useReservationActions();
  const isToastVisible = useToastStore((s) => s.isVisible);

  const openDatePicker = useCallback(() => {
    setIsDatePickerOpen(true);
    onDateTimeChange?.();
  }, [onDateTimeChange]);

  const openGuestCounter = useCallback(() => {
    setIsGuestModalOpen(true);
    onPersonCountChange?.();
  }, [onPersonCountChange]);

  const handleDateConfirm = useCallback(
    (dates: Date[]) => {
      actions.setDate(dates);
      setIsDatePickerOpen(false);
      setIsTimePickerOpen(true);
    },
    [actions]
  );

  const handleDateCancel = useCallback(() => {
    setIsDatePickerOpen(false);
  }, []);

  const validateTime = useCallback(
    (
      startHour: number,
      startPeriod: TimePeriod,
      endHour: number,
      endPeriod: TimePeriod
    ): ReservationToastKey | null => {
      const start24 = convertTo24Hour(startHour, startPeriod);
      const end24 = convertTo24Hour(endHour, endPeriod);

      // 1) 형식 오류: 시작과 종료가 완전히 동일한 경우만
      if (start24 === end24 && startPeriod === endPeriod) {
        return ReservationToastKey.INVALID_TYPE;
      }

      // 자정(12AM)은 다음날 24시로 간주하여 교차 자정 구간 허용
      const adjustedEnd = end24 <= start24 ? end24 + 24 : end24;
      const duration = adjustedEnd - start24; // 시간 단위

      // 2) 5시간 초과
      if (duration > 5) return ReservationToastKey.TOO_LONG;

      // 3) 1시간 선택
      if (duration === 1) return ReservationToastKey.TOO_SHORT;

      // 4) 과거 시간 선택: 당일이고 시작 시간이 현재 시각 이전이면
      if (selectedDate) {
        const now = new Date();
        const isSameDay =
          selectedDate.getFullYear() === now.getFullYear() &&
          selectedDate.getMonth() === now.getMonth() &&
          selectedDate.getDate() === now.getDate();
        if (isSameDay) {
          const currentHour24 = now.getHours();
          if (start24 <= currentHour24) return ReservationToastKey.PAST_TIME;
        }
      }

      return null;
    },
    [selectedDate]
  );

  const handleTimeConfirm = useCallback(
    (sh: number, sp: TimePeriod, eh: number, ep: TimePeriod) => {
      const errorKey = validateTime(sh, sp, eh, ep);
      if (errorKey) {
        showToastByKey(errorKey);
        return;
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
    },
    [actions, validateTime, selectedDate]
  );

  const handleTimeCancel = useCallback(() => {
    // 뒤로가기: TimePicker를 닫고 DatePicker로 복귀, 기존 날짜 유지
    setIsTimePickerOpen(false);
    setIsDatePickerOpen(true);
  }, []);
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
                // 필수값 체크
                if (!selectedDate) {
                  alert('날짜와 시간을 선택해 주세요.');
                  return;
                }
                const dateIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
                const slots = hourSlots && hourSlots.length > 0 ? hourSlots : [];
                if (slots.length === 0) {
                  alert('시간을 선택해 주세요.');
                  return;
                }
                // UI 라벨 업데이트 보정
                setDateTimeText(formatReservationLabel(dateIso, slots));
                onSearch({ date: dateIso, hour_slots: slots, peopleCount: peopleCountText });
              }}
              variant={ButtonVariant.Main}
              size={BtnSizeVariant.MD}
            />
          </div>
        </div>
      </div>

      {(isDatePickerOpen || isTimePickerOpen || isGuestModalOpen) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/80">
          {/* wrapper 기준 폭으로 중앙 정렬 */}
          <div className="w-[25.125rem] flex flex-col items-center">
            {isDatePickerOpen && (
              <DatePicker
                onConfirm={handleDateConfirm}
                onCancel={handleDateCancel}
                initialSelectedDate={selectedDate ?? undefined}
              />
            )}
            {isTimePickerOpen && (
              <TimePicker onConfirm={handleTimeConfirm} onCancel={handleTimeCancel} disabled={isToastVisible} />
            )}
            {isGuestModalOpen && (
              <GuestCounterModal
                open
                onClose={() => setIsGuestModalOpen(false)}
                onConfirm={(val) => {
                  setPeopleCountText(val);
                  setIsGuestModalOpen(false);
                }}
                initialCount={peopleCountText}
              />
            )}
            {/* 토스트는 모달 하단에 배치되도록 아래에 둔다 */}
            <div className="mt-3">
              <ToastMessage />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroArea;
