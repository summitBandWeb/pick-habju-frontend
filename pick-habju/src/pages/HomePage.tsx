import { useState } from 'react';
import Button from '../components/Button/Button';
import DatePicker from '../components/DatePicker/DatePicker';
import PaginationDots from '../components/PaginationDot/PaginationDot';
import TimePicker from '../components/TimePicker/TimePicker';
import { ButtonVariant, TimePeriod } from '../enums/components';

const HomePage = () => {
  const [startHour] = useState<number>(9);
  const [startPeriod] = useState<TimePeriod>(TimePeriod.AM);
  const [endHour] = useState<number>(5);
  const [endPeriod] = useState<TimePeriod>(TimePeriod.PM);
  return (
    <div>
      <Button label="검색하기" variant={ButtonVariant.Main} />
      <Button label="검색하기" variant={ButtonVariant.Sub} />
      <Button label="검색하기" variant={ButtonVariant.Text} />
      <PaginationDots total={5} current={0} />
      <DatePicker />
      <TimePicker
        startHour={startHour}
        startPeriod={startPeriod}
        endHour={endHour}
        endPeriod={endPeriod}
        // 변경될 때 부모가 값을 받으려면 onChange prop을 추가해도 좋지만,
        // 지금은 confirm/cancel 시에만 처리한다고 가정합니다.
        onConfirm={(sh, sp, eh, ep) => {
          console.log('확정된 시간:', sp, sh, '~', ep, eh);
        }}
        onCancel={() => {
          console.log('TimePicker 취소');
        }}
        // disabled 도 필요하면 넘겨주세요.
      />
    </div>
  );
};

export default HomePage;
