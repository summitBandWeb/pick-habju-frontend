import { useTimePickerInlineInput } from './useTimePickerInlineInput';
import type { TimePeriod } from '../TimePickerEnums';

export interface TimePickerInlineInputProps {
  startHour: number;
  startPeriod: TimePeriod;
  endHour: number;
  endPeriod: TimePeriod;
  onChange: (startHour: number, startPeriod: TimePeriod, endHour: number, endPeriod: TimePeriod) => void;
  onBlur?: () => void;
}

export const TimePickerInlineInput = ({
  startHour,
  startPeriod,
  endHour,
  endPeriod,
  onChange,
  onBlur,
}: TimePickerInlineInputProps) => {
  const {
    inputRef,
    rawDigits,
    handleKeyDown,
    handleBlur,
    handleContainerClick,
    displayStartHour,
    displayStartPeriod,
    displayEndHour,
    displayEndPeriod,
  } = useTimePickerInlineInput({
    startHour,
    startPeriod,
    endHour,
    endPeriod,
    onChange,
    onBlur,
  });

  // TimePickerBody와 동일: 숫자 슬롯(w-[1.8ch]) + AM/PM 고정(w-[2.6ch])
  // 0-2자리: 시작 시간만 입력 중 → 끝 시간은 props 초기값 유지
  const digitCount = rawDigits.length;
  const startHourDisplay = digitCount >= 1 ? String(displayStartHour) : '  ';
  const startPeriodDisplay = displayStartPeriod;
  const endHourDisplay = digitCount >= 3 ? String(displayEndHour) : String(endHour);
  const endPeriodDisplay = digitCount >= 3 ? displayEndPeriod : endPeriod;

  return (
    <div
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
