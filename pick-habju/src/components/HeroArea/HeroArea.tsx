import { useCallback, useState } from 'react';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import PersonCountInput from './Input/Person/PersonCountInput';
import DateTimeInput from './Input/\bDate/DateTimeInput';
import BackGroundImage from '../../assets/images/background.jpg';
import type { HeroAreaProps } from './HeroArea.types';
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import { TimePeriod } from '../TimePicker/TimePickerEnums';
import ToastMessage from '../ToastMessage/ToastMessage';
import { showToastByKey } from '../../utils/showToastByKey';
import { ReservationToastKey } from '../ToastMessage/ToastMessageEnums';
import { useReservationActions, useReservationState } from '../../hook/useReservationStore';
import { convertTo24Hour } from '../../utils/formatDate';
import { useToastStore } from '../../store/toast/toastStore';

const HeroArea = ({ dateTime, peopleCount, onDateTimeChange, onPersonCountChange, onSearch }: HeroAreaProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [dateTimeText, setDateTimeText] = useState<string>(dateTime);
  const { selectedDate } = useReservationState();
  const actions = useReservationActions();
  const isToastVisible = useToastStore((s) => s.isVisible);

  const openDatePicker = useCallback(() => {
    setIsDatePickerOpen(true);
    onDateTimeChange?.();
  }, [onDateTimeChange]);

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

      // 라벨 업데이트: M월 DD일 (요일) HH~HH시
      if (selectedDate) {
        const month = selectedDate.getMonth() + 1; // 1~12
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const weekdayKorean = ['일', '월', '화', '수', '목', '금', '토'][selectedDate.getDay()];
        const start24 = convertTo24Hour(sh, sp);
        const rawEnd24 = convertTo24Hour(eh, ep);
        const displayEndHour = rawEnd24 === 0 ? 24 : rawEnd24 <= start24 ? rawEnd24 + 24 : rawEnd24;
        setDateTimeText(`${month}월 ${day}일 (${weekdayKorean}) ${start24}~${displayEndHour}시`);
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
            <PersonCountInput count={peopleCount} onChangeClick={onPersonCountChange} />
          </div>
          <div>
            <Button label="검색하기" onClick={onSearch} variant={ButtonVariant.Main} size={BtnSizeVariant.MD} />
          </div>
        </div>
      </div>

      {(isDatePickerOpen || isTimePickerOpen) && (
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
