import { useCallback, useRef, useState } from 'react';
import { to2Digit24h, to12h } from '../../../utils/formatDate';
import { processDigitInput } from '../../../utils/timeInputUtils';
import type { TimePeriod } from '../TimePickerEnums';

export interface UseTimePickerInlineInputParams {
  startHour: number;
  startPeriod: TimePeriod;
  endHour: number;
  endPeriod: TimePeriod;
  onChange: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onBlur?: () => void;
}

export function useTimePickerInlineInput({
  startHour,
  startPeriod,
  endHour,
  endPeriod,
  onChange,
  onBlur,
}: UseTimePickerInlineInputParams) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rawDigits, setRawDigits] = useState(() => {
    const start = to2Digit24h(startHour, startPeriod);
    const end = to2Digit24h(endHour, endPeriod);
    return start + end;
  });

  /** 입력된 숫자 문자열(rawDigits)를 파싱해서 24h 숫자로 변환하고 to12h로 12h로 바꿔서 onChange에 넘김 */
  const parseAndNotify = useCallback(
    (digits: string) => {
      if (digits.length === 0) {
        onChange(startHour, startPeriod, endHour, endPeriod);
        return;
      }
      const startH24 = parseInt(digits.slice(0, 2).padStart(2, '0'), 10);
      const endH24 = digits.length >= 3 ? parseInt(digits.slice(2, 4).padStart(2, '0'), 10) : 0;
      const start12 = to12h(Math.min(23, startH24));
      const end12 = to12h(Math.min(23, endH24));
      onChange(start12.hour, start12.period, end12.hour, end12.period);
    },
    [onChange, startHour, startPeriod, endHour, endPeriod]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && rawDigits.length > 0) {
        e.preventDefault();
        const next = rawDigits.slice(0, -1);
        setRawDigits(next);
        parseAndNotify(next);
        return;
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        return;
      }
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        const next =
          rawDigits.length >= 4 ? processDigitInput('', e.key) : processDigitInput(rawDigits, e.key);
        setRawDigits(next);
        parseAndNotify(next);
      }
    },
    [rawDigits, parseAndNotify]
  );

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const digitCount = rawDigits.length;

  const startH24 =
    digitCount >= 1 ? Math.min(23, parseInt(rawDigits.slice(0, 2).padStart(2, '0'), 10)) : 0;
  const endH24 =
    digitCount >= 3 ? Math.min(23, parseInt(rawDigits.slice(2, 4).padStart(2, '0'), 10)) : 0;
  const start12 = to12h(startH24);
  const end12 = to12h(endH24);

  // 0-2자리: 시작 시간만 입력 중 → 끝 시간은 props 초기값 유지
  const displayStartHour = digitCount >= 1 ? start12.hour : startHour;
  const displayStartPeriod = digitCount >= 1 ? start12.period : startPeriod;
  const displayEndHour = digitCount >= 3 ? end12.hour : endHour;
  const displayEndPeriod = digitCount >= 3 ? end12.period : endPeriod;

  return {
    inputRef,
    rawDigits,
    handleKeyDown,
    handleBlur,
    handleContainerClick,
    displayStartHour,
    displayStartPeriod,
    displayEndHour,
    displayEndPeriod,
  };
}
