import Button from '../../../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../../../Button/ButtonEnums';
import type { BookStepInfoCheckProps } from './BookStepInfoModal.types';

const BookStepInfoCheck = ({ date, time, location, peopleCount, amount, onConfirm }: BookStepInfoCheckProps) => {
  const infoList = [
    { label: '날짜', value: date },
    { label: '시간', value: time },
    { label: '장소', value: location },
    { label: '인원', value: `${peopleCount}명` },
    { label: '금액', value: `${amount.toLocaleString()}원` },
  ];

  return (
    <div className="w-88 h-83 px-8 py-7 rounded-lg bg-primary-white flex flex-col justify-between">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-primary-black font-modal-default">이대로 예약을 진행할까요?</p>
          <p className="text-gray-300 font-button">2 of 2</p>
        </div>

        <div className="flex flex-col gap-2 text-gray-400 font-modal-description">
          {infoList.map(({ label, value }) => (
            <div key={label} className="flex gap-4 py-1">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button label="예약하러 가기" variant={ButtonVariant.Main} size={BtnSizeVariant.LG} onClick={onConfirm} />
      </div>
    </div>
  );
};

export default BookStepInfoCheck;
