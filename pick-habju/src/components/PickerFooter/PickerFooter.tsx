import type { PickerFooterProps } from './PickerFooter.types';

const PickerFooter = ({ onConfirm, onCancel, disabled = false, cancelText = '취소' }: PickerFooterProps) => (
  <div className="flex justify-end pt-2 pb-3 bg-primary-white gap-2 rounded-b-lg">
    <button onClick={onCancel} className="py-[14.5px] px-3 text-gray-300 font-button">
      {cancelText}
    </button>
    <button
      onClick={onConfirm}
      disabled={disabled}
      // w, h 아닌 padding 으로 구역 확보
      className={`py-[14.5px] px-3 font-button ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-yellow-900'}`}
    >
      확인
    </button>
  </div>
);

export default PickerFooter;
