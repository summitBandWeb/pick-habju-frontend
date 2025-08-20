import { useCallback, useEffect, useState } from 'react';
import BookStepInfoCheck from './StepTwo/BookStepInfoModal';
import BookStepCalculationModal from './StepOne/BookStepCalculationModal';
import type { RoomMetadata } from '../../../types/RoomMetadata';
import { getPriceBreakdown, getRoomLocationLine } from '../../../utils/calcTotalPrice';
import { getBookingUrl } from '../../../utils/bookingUrl';
import { formatDateKoreanWithWeekday, formatTimeRangeFromSlots } from '../../../utils/dateTimeLabel';

export interface BookModalStepperProps {
  room: RoomMetadata;
  dateIso: string; // YYYY-MM-DD
  hourSlots: string[]; // 예: ["18:00","19:00"]
  peopleCount: number;
  finalTotalFromCard: number; // 카드에 표시된 최종 금액 재사용
  onConfirm: () => void;
  onClose?: () => void;
}

const BookModalStepper = ({ room, dateIso, hourSlots, peopleCount, finalTotalFromCard, onConfirm, onClose }: BookModalStepperProps) => {
  const [step, setStep] = useState<1 | 2>(1);

  const breakdown = getPriceBreakdown({ room, hourSlots, peopleCount });
  const locationLine = getRoomLocationLine(room);
  const timeText = formatTimeRangeFromSlots(hourSlots);

  const close = useCallback(() => {
    // 부모에서 overlay를 지울 책임 (DefaultView에서 상태로 제어)
    // 여기서는 단순히 step 초기화만
    setStep(1);
    onClose?.();
  }, [onClose]);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  // 바깥 클릭 닫기는 ModalOverlay에서 처리

  return (
      <div className="w-full max-w-[25.125rem]" onClick={(e) => e.stopPropagation()}>
        {step === 1 && (
          <BookStepCalculationModal
            basicAmount={breakdown.basicAmount}
            hours={breakdown.hours}
            addPersonCount={breakdown.addPersonCount}
            addAmountPerPerson={breakdown.addAmountPerPerson}
            baseTotal={breakdown.baseTotal}
            addTotal={breakdown.addTotal}
            finalTotal={finalTotalFromCard}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <BookStepInfoCheck
            date={formatDateKoreanWithWeekday(dateIso)}
            time={timeText}
            location={locationLine}
            peopleCount={peopleCount}
            amount={finalTotalFromCard}
            onConfirm={() => {
              const url = getBookingUrl(room, dateIso);
              window.open(url, '_blank');
              onConfirm();
            }}
          />
        )}
      </div>
  );
};

export default BookModalStepper;
