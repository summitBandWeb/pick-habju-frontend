interface TimePickerBodyTimeInfoProps {
  selectedDurationHours: number;
}

const TimePickerBodyTimeInfo = ({ selectedDurationHours }: TimePickerBodyTimeInfoProps) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="mx-auto flex w-70 items-center justify-center gap-2.5 border-y-2 border-gray-100 bg-primary-white px-13 py-3"
  >
    <p className="font-modal-calctype text-gray-300">
      총 <span className="text-blue-500">{selectedDurationHours}시간</span> 이용
    </p>
  </div>
);

export default TimePickerBodyTimeInfo;
