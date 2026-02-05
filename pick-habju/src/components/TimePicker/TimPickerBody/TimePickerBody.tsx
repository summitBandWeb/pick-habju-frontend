import { useState } from 'react';
import ScrollPicker from '../ScrollPicker/ScrollPicker';
import { useTimePickerInlineInput } from '../TimePickerInlineInput/useTimePickerInlineInput';
import type { TimePickerBodyProps } from './TimePickerBody.types';
import type { TimePeriod } from '../TimePickerEnums';

const hours = Array.from({ length: 12 }, (_, i) => (i + 1) as number);
const periods: ('AM' | 'PM')[] = ['AM', 'PM'];

export const TimePickerBody = ({
  startHour,
  startPeriod,
  endHour,
  endPeriod,
  onChange,
  disabled = false,
}: TimePickerBodyProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleNumberAreaClick = () => {
    if (disabled) return;
    setIsEditMode(true);
  };

  const handleInlineInputBlur = () => {
    setIsEditMode(false);
  };

  const inlineInput = useTimePickerInlineInput({
    startHour,
    startPeriod,
    endHour,
    endPeriod,
    onChange,
    onBlur: handleInlineInputBlur,
  });

  if (isEditMode) {
    return (
      <div className="relative inline-flex items-center justify-center w-[19.875rem] h-[15.5rem] bg-primary-white overflow-hidden">
        <div
          role="button"
          tabIndex={-1}
          onClick={() => inlineInput.inputRef.current?.focus()}
          onKeyDown={() => {}}
          className="absolute inset-0 z-10 cursor-text"
          aria-hidden
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[16.75rem] h-[2.75rem] rounded-[0.5rem] bg-[var(--Gray-100,#F1F1F1)] shadow-[0_2px_4px_0_rgba(0,0,0,0.12)]"
        />
        <input
          ref={inlineInput.inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={4}
          value={inlineInput.rawDigits}
          readOnly
          autoFocus
          onKeyDown={inlineInput.handleKeyDown}
          onBlur={inlineInput.handleBlur}
          className="absolute w-0 h-0 opacity-0 pointer-events-none"
          aria-label="시간 입력 (4자리)"
        />
        <div className="relative flex items-center space-x-[0.375rem] px-6 py-2 font-modal-timepicker">
          {/* Start - ScrollPicker로 위/아래 숫자 표시 */}
          <div className="flex items-center space-x-1">
            <div className="w-[1.8ch] flex justify-center">
              <ScrollPicker
                list={hours}
                value={inlineInput.displayStartHour}
                onChange={() => {}}
                itemHeight={44}
                disabled
              />
            </div>
            <div className="w-[2.6ch] flex justify-center">
              <ScrollPicker
                list={periods}
                value={inlineInput.displayStartPeriod}
                onChange={() => {}}
                itemHeight={44}
                disabled
              />
            </div>
          </div>
          <span className="text-2xl text-black w-[1.4ch] text-center">~</span>
          {/* End */}
          <div className="flex items-center space-x-1">
            <div className="w-[1.8ch] flex justify-center">
              <ScrollPicker
                list={hours}
                value={inlineInput.displayEndHour}
                onChange={() => {}}
                itemHeight={44}
                disabled
              />
            </div>
            <div className="w-[2.6ch] flex justify-center">
              <ScrollPicker
                list={periods}
                value={inlineInput.displayEndPeriod}
                onChange={() => {}}
                itemHeight={44}
                disabled
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center justify-center w-[19.875rem] h-[15.5rem] bg-primary-white overflow-hidden">
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[16.75rem] h-[2.75rem] rounded-lg bg-primary-white shadow-filter" />
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleNumberAreaClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleNumberAreaClick();
        }}
        className="absolute left-1/2 top-1/2 z-10 h-[2.75rem] w-[16.75rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-lg"
        aria-label="편집 모드로 전환"
      />
      <div className="relative flex items-center space-x-[0.375rem] px-6 py-2 font-modal-timepicker">
          {/* Start */}
          <div className="flex items-center space-x-1">
            <div className="w-[1.8ch] flex justify-center">
              <ScrollPicker
                list={hours}
                value={startHour}
                onChange={(newStartHour) => onChange(newStartHour, startPeriod, endHour, endPeriod)}
                itemHeight={44}
                disabled={disabled}
              />
            </div>
            <div className="w-[2.6ch] flex justify-center">
              <ScrollPicker
                list={periods}
                value={startPeriod}
                onChange={(newStartPeriod) => onChange(startHour, newStartPeriod as TimePeriod, endHour, endPeriod)}
                itemHeight={44}
                disabled={disabled}
              />
            </div>
          </div>
          <span className="text-2xl text-black w-[1.4ch] text-center">~</span>
          {/* End */}
          <div className="flex items-center space-x-1">
            <div className="w-[1.8ch] flex justify-center">
              <ScrollPicker
                list={hours}
                value={endHour}
                onChange={(newEndHour) => onChange(startHour, startPeriod, newEndHour, endPeriod)}
                itemHeight={44}
                disabled={disabled}
              />
            </div>
            <div className="w-[2.6ch] flex justify-center">
              <ScrollPicker
                list={periods}
                value={endPeriod}
                onChange={(newEndPeriod) => onChange(startHour, startPeriod, endHour, newEndPeriod as TimePeriod)}
                itemHeight={44}
                disabled={disabled}
              />
            </div>
          </div>
        </div>
    </div>
  );
};
