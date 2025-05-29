import Button from '../../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../../Button/ButtonEnums';
import type { BookStepPriceProps } from './BookStepCalculationModal.types';

const BookStepPrice = ({
  basicAmount,
  hours,
  addPersonCount = 0,
  addAmountPerPerson = 0,
  baseTotal,
  addTotal,
  finalTotal,
  onNext,
}: BookStepPriceProps) => {
  return (
    <div className="w-88 h-83 px-8 py-7 rounded-lg bg-primary-white flex flex-col justify-between">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center font-modal-default">
          <p className="text-primary-black">최종 금액을 확인해주세요</p>
          <p className="text-gray-400 font-button">1 of 2</p>
        </div>

        <div className="pt-4 space-y-2 text-gray-400">
          <div className="font-modal-description">기본 금액</div>
          <div className="font-modal-calcdetail">
            시간당 {basicAmount.toLocaleString()}원 * {hours}시간 = {baseTotal.toLocaleString()}원
          </div>
        </div>

        <div className="space-y-2 text-gray-400">
          <div className="font-modal-description">추가 금액</div>
          {addPersonCount > 0 ? (
            <div className="font-modal-calcdetail">
              시간당 1인 {addAmountPerPerson.toLocaleString()}원 * {addPersonCount}인 = {addTotal.toLocaleString()}원
            </div>
          ) : (
            <div className="font-modal-calcdetail text-gray-400">0원</div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <span className="font-modal-calctype text-gray-600">최종 금액</span>
          <span className="font-modal-calctype text-gray-400">{finalTotal.toLocaleString()}원</span>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          label={`${finalTotal.toLocaleString()}원 결제하기`}
          variant={ButtonVariant.Main}
          size={BtnSizeVariant.LG}
          disabled={finalTotal <= 0}
          onClick={onNext}
        />
      </div>
    </div>
  );
};

export default BookStepPrice;
