import { useState } from 'react';
import Button from '../components/Button/Button';
import DatePicker from '../components/DatePicker/DatePicker';
import TimePicker from '../components/TimePicker/TimePicker';
import ToastMessage from '../components/ToastMessage/ToastMessage';
import { TimePeriod } from '../components/TimePicker/TimePickerEnums';
import { ButtonVariant } from '../components/Button/ButtonEnums';
import { showToastByKey } from '../utils/showToastByKey';
import { ReservationToastKey } from '../components/ToastMessage/ToastMessageEnums';
import PaginationDots from '../components/PaginationDot/PaginationDot';
import GuestCounterModal from '../components/GuestCounterModal/GuestCounterModal'; // 추가

const HomePage = () => {
  const [startHour] = useState<number>(9);
  const [startPeriod] = useState<TimePeriod>(TimePeriod.AM);
  const [endHour] = useState<number>(5);
  const [endPeriod] = useState<TimePeriod>(TimePeriod.PM);

  // ✅ 모달 관련 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-6 p-10 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-bold">🔥 HomePage 테스트용</h1>

      <div className="flex gap-2">
        <Button label="검색하기" variant={ButtonVariant.Main} />
        <Button label="검색하기" variant={ButtonVariant.Sub} />
        <Button label="검색하기" variant={ButtonVariant.Text} />
      </div>

      <PaginationDots total={5} current={0} />

      <DatePicker />

      <TimePicker
        startHour={startHour}
        startPeriod={startPeriod}
        endHour={endHour}
        endPeriod={endPeriod}
        onConfirm={(sh, sp, eh, ep) => {
          console.log('확정된 시간:', sp, sh, '~', ep, eh);
        }}
        onCancel={() => {
          console.log('TimePicker 취소');
        }}
      />

      {/* ✅ GuestCounterModal 열기 버튼 */}
      <Button label="인원 수 선택" variant={ButtonVariant.Main} onClick={() => setModalOpen(true)} />

      {/* ✅ 선택된 인원 표시 */}
      {guestCount !== null && <p className="text-primary-black font-medium">선택된 인원: {guestCount}명</p>}

      {/* ✅ GuestCounterModal */}
      <GuestCounterModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialCount={guestCount ?? 1}
        onConfirm={(count) => {
          setGuestCount(count);
          console.log('선택된 인원 수:', count);
        }}
      />

      {/* ✅ 토스트 테스트 */}
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
