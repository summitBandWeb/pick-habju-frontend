import { useState } from 'react';
import BookStepInfoCheck from './StepTwo/BookStepInfoModal';
import { useCalculateTotals } from './useCalculateTotals';
import BookStepCalculationModal from './StepOne/BookStepCalculationModal';

const BookModalStepper = () => {
  const [step, setStep] = useState<1 | 2>(1);

  // 임시 데이터
  const basicAmount: number = 17000;
  const hours: number = 3;
  const addPersonCount: number = 4; // 추가 인원 수
  const addAmountPerPerson: number = 1000; // 1인당 추가 금액
  const date: string = '2025년 5월 23일 금요일';
  const time: string = '17시-20시';
  const location: string = '준사운드 S룸';
  const peopleCount: number = 10;

  // 최종 금액 계산
  const { baseTotal, addTotal, finalAmount } = useCalculateTotals(
    basicAmount,
    hours,
    addPersonCount,
    addAmountPerPerson
  );

  return (
    <div>
      {step === 1 && (
        <BookStepCalculationModal
          basicAmount={basicAmount}
          hours={hours}
          addPersonCount={addPersonCount}
          addAmountPerPerson={addAmountPerPerson}
          baseTotal={baseTotal}
          addTotal={addTotal}
          finalTotal={finalAmount}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <BookStepInfoCheck
          date={date}
          time={time}
          location={location}
          peopleCount={peopleCount}
          amount={finalAmount}
          onConfirm={() => alert('예약이 완료되었습니다!')}
        />
      )}
    </div>
  );
};

export default BookModalStepper;
