export interface DatePickerFooterProps {
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

const DatePickerFooter = ({ onConfirm, onCancel, disabled = false }: DatePickerFooterProps) => (
  <div className="flex justify-end pt-2 pb-3 bg-primary-white gap-2 rounded-b-lg">
    <button onClick={onCancel} className="w-12 h-12 text-gray-300 font-button">
      취소
    </button>
    <button
      onClick={onConfirm}
      disabled={disabled}
      className={`w-12 h-12 font-button ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-yellow-900'}`}
    >
      확인
    </button>
  </div>
);

export default DatePickerFooter;
