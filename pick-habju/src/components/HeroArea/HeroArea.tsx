import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';

import PersonCountInput from './Input/Person/PersonCountInput';
import DateTimeInput from './Input/\bDate/DateTimeInput';

import BackGroundImage from '../../assets/images/background.jpg';
import type { HeroAreaProps } from './HeroArea.types';

const HeroArea = ({ dateTime, peopleCount, onDateTimeChange, onPersonCountChange, onSearch }: HeroAreaProps) => {
  return (
    <div
      className="relative w-94.5 h-97.5 flex flex-col items-center"
      style={{
        backgroundImage: `url(${BackGroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* 오버레이 레이어 */}
      <div className="absolute inset-0 bg-primary-black opacity-50 z-0" />

      {/* 실제 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-primary-white font-hero-headline mt-15.5 mb-8">합주실 예약 현황을 한눈에</h1>

        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-3 mb-8">
            <DateTimeInput dateTime={dateTime} onChangeClick={onDateTimeChange} />
            <PersonCountInput count={peopleCount} onChangeClick={onPersonCountChange} />
          </div>
          <div>
            <Button label="검색하기" onClick={onSearch} variant={ButtonVariant.Main} size={BtnSizeVariant.MD} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroArea;
