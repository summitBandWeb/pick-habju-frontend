import { useCallback, useEffect, useState } from 'react';
import BookStepInfoCheck from './StepTwo/BookStepInfoModal';
import BookStepCalculationModal from './StepOne/BookStepCalculationModal';
import type { RoomMetadata } from '../../../types/RoomMetadata';
import { getPriceBreakdown, getRoomLocationLine } from '../../../utils/calcTotalPrice';
import { getBookingUrl } from '../../../utils/bookingUrl';
import { formatDateKoreanWithWeekday, formatTimeRangeFromSlots } from '../../../utils/dateTimeLabel';
import { useSessionAnalyticsStore } from '../../../store/analytics/sessionStore';
import { pushGtmEvent } from '../../../utils/gtm';

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
  const incrementBookModalOpen = useSessionAnalyticsStore((s) => s.incrementBookModalOpen);
  const markEnterStep1 = useSessionAnalyticsStore((s) => s.markEnterStep1);
  const markEnterStep2 = useSessionAnalyticsStore((s) => s.markEnterStep2);
  const markStep2Confirm = useSessionAnalyticsStore((s) => s.markStep2Confirm);

  const breakdown = getPriceBreakdown({ room, hourSlots, peopleCount, dateIso });
  const locationLine = getRoomLocationLine(room);
  const timeText = formatTimeRangeFromSlots(hourSlots);

  const close = useCallback(() => {
    // 부모에서 overlay를 지울 책임 (DefaultView에서 상태로 제어)
    // 여기서는 단순히 step 초기화만
    setStep(1);
    onClose?.();
  }, [onClose]);
  // 모달 최초 마운트 시 세션 카운트 증가 및 Step1 진입 타임스탬프 기록
  useEffect(() => {
    incrementBookModalOpen();
    markEnterStep1();
    pushGtmEvent('book_modal_open');
  }, [incrementBookModalOpen, markEnterStep1]);


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
      <div className="w-full max-w-[25.9375rem]" onClick={(e) => e.stopPropagation()}>
        {step === 1 && (
          <BookStepCalculationModal
            basicAmount={breakdown.basicAmount}
            hours={breakdown.hours}
            addPersonCount={breakdown.addPersonCount}
            addAmountPerPerson={breakdown.addAmountPerPerson}
            baseTotal={breakdown.baseTotal}
            addTotal={breakdown.addTotal}
            finalTotal={finalTotalFromCard}
            onNext={() => {
              setStep(2);
              markEnterStep2();
              pushGtmEvent('book_modal_step_change', { to_step: 2 });
            }}
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
              // 새창 열기 시도, 실패시 현재 탭에서 이동
              const newWindow = window.open(url, '_blank');
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                // 팝업이 차단되었을 경우 현재 탭에서 이동
                window.location.href = url;
              }
              markStep2Confirm();
              pushGtmEvent('book_modal_step2_confirm');
              onConfirm();
            }}
          />
        )}
      </div>
  );
};

export default BookModalStepper;
