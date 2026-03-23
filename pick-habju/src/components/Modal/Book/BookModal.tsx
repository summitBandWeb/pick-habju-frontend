import { useCallback, useEffect, useRef, useState } from 'react';
import BookStepInfoCheck from './StepTwo/BookStepInfoModal';
import BookStepCalculationModal from './StepOne/BookStepCalculationModal';
import type { NormalizedRoom } from '../../../hook/useMapPageSearch';
import { getPriceBreakdown, getRoomLocationLine } from '../../../utils/calcTotalPrice';
import { getBookingUrl } from '../../../utils/bookingUrl';
import {
  formatDateKoreanWithWeekday,
  formatDateMonthDayWithWeekday,
  formatTimeRangeFromSlots,
} from '../../../utils/dateTimeLabel';
import { useSessionAnalyticsStore } from '../../../store/analytics/sessionStore';
import { useToastStore } from '../../../store/toast/toastStore';
import { pushGtmEvent } from '../../../utils/gtm';
import ModalOverlay from '../ModalOverlay';
import ShareReservationMessageModal from '../Share/ShareReservationMessageModal';

export interface BookModalStepperProps {
  open?: boolean;
  room: NormalizedRoom;
  dateIso: string; // YYYY-MM-DD
  hourSlots: string[]; // 예: ["18:00","19:00"]
  peopleCount: number;
  onConfirm: () => void;
  onClose?: () => void;
}

const BookModalStepper = ({
  open = true,
  room,
  dateIso,
  hourSlots,
  peopleCount,
  onConfirm,
  onClose,
}: BookModalStepperProps) => {
  const [step, setStep] = useState<1 | 2 | 'share'>(1);
  const incrementBookModalOpen = useSessionAnalyticsStore((s) => s.incrementBookModalOpen);
  const markEnterStep1 = useSessionAnalyticsStore((s) => s.markEnterStep1);
  const markEnterStep2 = useSessionAnalyticsStore((s) => s.markEnterStep2);
  const markStep2Confirm = useSessionAnalyticsStore((s) => s.markStep2Confirm);

  const breakdown = getPriceBreakdown({ room, hourSlots, peopleCount, estimatedPrice: room.estimated_price });
  const locationLine = getRoomLocationLine(room);
  const timeText = formatTimeRangeFromSlots(hourSlots);

  const close = useCallback(() => {
    setStep(1);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    incrementBookModalOpen();
    markEnterStep1();
    pushGtmEvent('book_modal_open');
  }, [incrementBookModalOpen, markEnterStep1]);

  const { showToast } = useToastStore();
  const isSharingRef = useRef(false);

  const navigateToBooking = useCallback(() => {
    const url = getBookingUrl({ businessId: room.business_id, bizItemId: room.biz_item_id }, dateIso);
    const newWindow = window.open(url, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = url;
    }
  }, [room.business_id, room.biz_item_id, dateIso]);

  const handleShare = useCallback(async () => {
    if (isSharingRef.current) return;
    isSharingRef.current = true;

    const parseHour = (s: string) => parseInt(s.split(':')[0], 10) || 0;
    const start = parseHour(hourSlots[0]);
    const last = parseHour(hourSlots[hourSlots.length - 1]);
    const end = (last + 1) % 24 || 24;

    const dateLine = formatDateMonthDayWithWeekday(dateIso);
    const startStr = `${String(start).padStart(2, '0')}:00`;
    const endStr = `${String(end).padStart(2, '0')}:00`;

    const url = getBookingUrl({ businessId: room.business_id, bizItemId: room.biz_item_id }, dateIso);
    const perPerson = Math.round(room.estimated_price / peopleCount);
    const text = [
      '🎸 [픽합주] 합주실 예약 공지',
      '',
      `📍 ${getRoomLocationLine(room)}`,
      `🗓 ${dateLine}`,
      `⏰ ${startStr} ~ ${endStr}`,
      `💰 ${room.estimated_price.toLocaleString('ko-KR')}원 (인당 ${perPerson.toLocaleString('ko-KR')}원)`,
      '',
      '📍 위치 보기',
      url,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      showToast('공지 내용을 복사했습니다!', 'warning');
      setTimeout(() => {
        navigateToBooking();
        onConfirm();
      }, 1000);
    } catch {
      showToast('복사에 실패했습니다.', 'warning');
      isSharingRef.current = false;
    }
  }, [room, dateIso, hourSlots, peopleCount, showToast, navigateToBooking, onConfirm]);

  return (
    <ModalOverlay open={open} onClose={close}>
      <div className="w-full max-w-[25.9375rem]">
        {step === 1 && (
          <BookStepCalculationModal
            basicAmount={breakdown.basicAmount}
            hours={breakdown.hours}
            addPersonCount={breakdown.addPersonCount}
            addAmountPerPerson={breakdown.addAmountPerPerson}
            baseTotal={breakdown.baseTotal}
            addTotal={breakdown.addTotal}
            finalTotal={breakdown.finalTotal}
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
            amount={room.estimated_price}
            onConfirm={() => {
              markStep2Confirm();
              pushGtmEvent('book_modal_step2_confirm');
              setStep('share');
            }}
          />
        )}
        {step === 'share' && (
          <ShareReservationMessageModal
            onShare={handleShare}
            onSkip={() => {
              navigateToBooking();
              onConfirm();
            }}
          />
        )}
      </div>
    </ModalOverlay>
  );
};

export default BookModalStepper;
