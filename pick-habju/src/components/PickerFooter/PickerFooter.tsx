import type { PickerFooterProps } from './PickerFooter.types';

const PickerFooter = ({ onConfirm, onCancel, disabled = false, cancelText = '취소' }: PickerFooterProps) => (
  <div className="flex justify-end pt-2 pb-3 px-3 bg-primary-white gap-2 rounded-b-lg">
    <button
      onClick={onCancel}
      // 14.5 고치고 싶긴한데  py-3.625 는 따로 없네요 ..
      className="py-[14.5px] px-3 text-gray-300 font-button rounded-lg transition hover:bg-gray-300 hover:text-white"
    >
      {cancelText}
    </button>
    <button
      onClick={onConfirm}
      disabled={disabled}
      // w, h 아닌 padding 으로 구역 확보
      className={`py-[14.5px] px-3 font-button rounded-lg transition ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-yellow-900 hover:bg-yellow-900 hover:text-primary-white'}`}
    >
      확인
    </button>
  </div>
);

export default PickerFooter;
