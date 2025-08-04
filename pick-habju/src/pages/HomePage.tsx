'use client';

import { useState } from 'react';
import clsx from 'clsx';

// 컴포넌트 import
import Button from '../components/Button/Button';
import DatePicker from '../components/DatePicker/DatePicker';
import TimePicker from '../components/TimePicker/TimePicker';
import ToastMessage from '../components/ToastMessage/ToastMessage';
import PaginationDots from '../components/PaginationDot/PaginationDot';
import GuestCounterModal from '../components/GuestCounterModal/GuestCounterModal';
import { ButtonVariant } from '../components/Button/ButtonEnums';

import { showToastByKey } from '../utils/showToastByKey';
import { ReservationToastKey } from '../components/ToastMessage/ToastMessageEnums';
import {
  useIsDatePickerOpen,
  useIsTimePickerOpen,
  useReservationActions,
  useReservationPayload,
  useReservationState,
} from '../hook/useReservationStore';

const HomePage = () => {
  // 로컬 UI 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState<number | null>(null);

  // Zustand 스토어에서 상태와 액션을 가져옴
  const { setDate, setHourSlots, openDatePicker, closeDatePicker, openTimePicker, closeTimePicker } =
    useReservationActions();
  const { formattedDate, hourSlots } = useReservationState();
  const isDatePickerOpen = useIsDatePickerOpen();
  const isTimePickerOpen = useIsTimePickerOpen();
  const reservationPayload = useReservationPayload();

  return (
    <div className="flex flex-col items-center gap-6 p-10 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold">🔥 HomePage 테스트용</h1>

      <div className="flex gap-2">
        <Button label="검색하기" variant={ButtonVariant.Main} />
        <Button label="검색하기" variant={ButtonVariant.Sub} />
        <Button label="검색하기" variant={ButtonVariant.Text} />
      </div>

      <PaginationDots total={5} current={0} />

      {/* DatePicker & TimePicker UI */}
      <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md">
        <h2 className="font-bold">예약 날짜 및 시간 선택 (Zustand)</h2>
        <div className="flex w-full items-center justify-center gap-4">
          {/* DatePicker UI */}
          <div className="relative">
            <button
              onClick={openDatePicker}
              className="px-12pxr py-6pxr rounded-4pxr w-261pxr border-stroke-200 flex items-center justify-between border bg-white text-left"
            >
              <p className={clsx('text-b3-rg', formattedDate ? 'text-black' : 'text-gray-400')}>
                {formattedDate || '날짜를 선택해 주세요.'}
              </p>
            </button>
            {isDatePickerOpen && (
              <div className="absolute top-full left-0 z-10 mt-2">
                <DatePicker
                  onConfirm={(selected) => {
                    setDate(selected);
                    closeDatePicker();
                  }}
                  onCancel={closeDatePicker}
                />
              </div>
            )}
          </div>

          {/* TimePicker UI */}
          <div className="relative">
            <button
              onClick={openTimePicker}
              className="px-12pxr py-6pxr rounded-4pxr w-261pxr border-stroke-200 flex items-center justify-between border bg-white text-left"
            >
              <p className={clsx('text-b3-rg', hourSlots.length > 0 ? 'text-black' : 'text-gray-400')}>
                {hourSlots.length > 0 ? `${hourSlots[0]} ~` : '시간을 선택해 주세요.'}
              </p>
            </button>
            {isTimePickerOpen && (
              <div className="absolute top-full left-0 z-10 mt-2">
                <TimePicker
                  onConfirm={(sh, sp, eh, ep) => {
                    setHourSlots(sh, sp, eh, ep);
                    closeTimePicker();
                  }}
                  onCancel={closeTimePicker}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 최종 데이터 표시 */}
      {reservationPayload && (
        <div className="mt-4 p-4 bg-gray-200 rounded-md w-full max-w-md">
          <h3 className="font-bold text-lg mb-2">백엔드 전송용 최종 데이터</h3>
          <pre className="text-sm bg-gray-800 text-white p-2 rounded">
            {JSON.stringify(reservationPayload, null, 2)}
          </pre>
        </div>
      )}

      {/* GuestCounterModal 열기 버튼 */}
      <Button label="인원 수 선택" variant={ButtonVariant.Main} onClick={() => setModalOpen(true)} />

      {/* 선택된 인원 표시 */}
      {guestCount !== null && <p className="text-primary-black font-medium">선택된 인원: {guestCount}명</p>}

      {/* GuestCounterModal */}
      <GuestCounterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCount={guestCount ?? 1}
        onConfirm={(count) => {
          setGuestCount(count);
          console.log('선택된 인원 수:', count);
        }}
      />

      {/* ✅ 토스트 테스트 버튼들 추가 */}
      <div className="flex gap-3">
        <Button
          label="과거 시간"
          variant={ButtonVariant.Main}
          onClick={() => showToastByKey(ReservationToastKey.PAST_TIME)}
        />
        <Button
          label="너무 김"
          variant={ButtonVariant.Main}
          onClick={() => showToastByKey(ReservationToastKey.TOO_LONG)}
        />
        <Button
          label="너무 짧음"
          variant={ButtonVariant.Main}
          onClick={() => showToastByKey(ReservationToastKey.TOO_SHORT)}
        />
        <Button
          label="인원 초과"
          variant={ButtonVariant.Main}
          onClick={() => showToastByKey(ReservationToastKey.TOO_MANY_PEOPLE)}
        />
      </div>

      <ToastMessage />
    </div>
  );
};

export default HomePage;
