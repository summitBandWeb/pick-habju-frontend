import { useCallback, useRef, useState } from 'react';
import { convertTo24Hour, to12h } from '../../../utils/formatDate';
import type { TimePeriod } from '../TimePickerEnums';

export interface TimePickerInlineInputProps {
  startHour: number;
  startPeriod: TimePeriod;
  endHour: number;
  endPeriod: TimePeriod;
  onChange: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onBlur?: () => void;
}

/** props 값을 24h 시간으로 변환하고 변환된 시간을 2자리 24h 문자열로 변환
 * rawDigits 초기값 설정 시 사용
 * 12h 값을 2자리 24h 문자열로 (00-23) */
function to2Digit24h(hour: number, period: TimePeriod): string {
  const h = convertTo24Hour(hour, period);
  return h.toString().padStart(2, '0');
}

/**
 * 숫자 키 입력했을 때 가능한 시간인지 검사하고 가능한 시간이면 추가, 불가능한 시간이면 다음 칸으로 넘김.
 * 24h 유효성 검사 후 digit 추가. 무효 입력 시 자동으로 다음 칸으로 넘김.
 * - 첫 자리 3-9: 앞에 0 추가 → "3" → "03"
 * - 첫 자리 2, 둘째 자리 4-9: 2 앞에 0 삽입, 5 앞에도 0 삽입 → "2"+"5" → "0205"
 * - 끝 시간 첫 자리 3-9일 때 둘째 자리 입력: 5 앞에 0 삽입 → "025"+"6" → "0205"
 */
function processDigitInput(current: string, digit: string): string {
  if (current.length >= 4) return digit;
  const d = parseInt(digit, 10);
  const len = current.length;

  if (len === 0 || len === 2) {
    if (d >= 3) return (current + '0' + digit).slice(0, 4);
    return current + digit;
  }
  if (len === 1 || len === 3) {
    const first = parseInt(current[len - 1], 10);
    if (first === 2 && d >= 4)
      return (current.slice(0, -1) + '0' + current.slice(-1) + '0' + digit).slice(0, 4);
    if (len === 3 && first >= 3)
      return (current.slice(0, 2) + '0' + current[2] + digit).slice(0, 4);
    return current + digit;
  }
  return current + digit;
}

export const TimePickerInlineInput = ({
  startHour,
  startPeriod,
  endHour,
  endPeriod,
  onChange,
  onBlur,
}: TimePickerInlineInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // TimePickerBody와 동일: 숫자 슬롯(w-[1.8ch]) + AM/PM 고정(w-[2.6ch])
  // 0-2자리: 시작 시간만 입력 중 → 끝 시간은 props 초기값 유지
  const startHourDisplay = digitCount >= 1 ? String(start12.hour) : '  ';
  const startPeriodDisplay = start12.period;
  const endHourDisplay = digitCount >= 3 ? String(end12.hour) : String(endHour);
  const endPeriodDisplay = digitCount >= 3 ? end12.period : endPeriod;

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={-1}
      onClick={handleContainerClick}
      onKeyDown={() => {}}
      className="flex items-center justify-center space-x-[0.375rem] px-6 py-2 w-[16.75rem] h-[2.75rem] rounded-lg bg-gray-100 shadow-filter font-modal-timepicker cursor-text"
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
        value={rawDigits}
        readOnly
        autoFocus
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
        aria-label="시간 입력 (4자리)"
      />
      {/* Start: [숫자] AM - TimePickerBody와 동일 레이아웃 */}
      <div className="flex items-center space-x-1">
        <div className="w-[1.8ch] flex justify-center font-semibold">
          {startHourDisplay}
        </div>
        <div className="w-[2.6ch] flex justify-center font-semibold">{startPeriodDisplay}</div>
      </div>
      <span className="text-2xl text-black w-[1.4ch] text-center">~</span>
      {/* End: [숫자] AM - TimePickerBody와 동일 레이아웃 */}
      <div className="flex items-center space-x-1">
        <div className="w-[1.8ch] flex justify-center font-semibold">
          {endHourDisplay}
        </div>
        <div className="w-[2.6ch] flex justify-center font-semibold">{endPeriodDisplay}</div>
      </div>
    </div>
  );
};
