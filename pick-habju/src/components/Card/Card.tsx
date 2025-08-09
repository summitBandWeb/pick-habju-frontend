import { useState } from 'react';
import classNames from 'classnames';
import Button from '../Button/Button';
import PaginationDots from '../PaginationDot/PaginationDot';
import Chevron from '../Chevron/Chevron';
import Location from '../../assets/svg/location.svg';
import People from '../../assets/svg/people.svg';
import type { CardProps } from './Card.types';
import { ChevronVariant } from '../Chevron/ChevronEnums';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';

const Card = ({
  images,
  title,
  subtitle,
  price,
  locationText,
  walkTime,
  capacity,
  booked = false,
  btnsize,
  initialIndex = 0,
}: CardProps) => {
  const [current, setCurrent] = useState(initialIndex);
  const total = images.length;

  const variant: ChevronVariant = booked
    ? ChevronVariant.Middle
    : current === 0
      ? ChevronVariant.First
      : current === total - 1
        ? ChevronVariant.Last
        : ChevronVariant.Middle;

  const prev = () => setCurrent((p) => Math.max(0, p - 1));
  const next = () => setCurrent((p) => Math.min(total - 1, p + 1));

  // 렌더 함수 분리

  const renderHeader = () => (
    <div className="absolute top-6 left-4 flex items-start space-x-[9px] text-primary-white">
      <div className="w-0.5 h-12.5 bg-white" />
      <div className="space-y-1">
        <p className="font-card-title">{title}</p>
        <p className="font-card-title">{subtitle}</p>
      </div>
    </div>
  );

  const renderOverlay = () =>
    booked && (
      <div className="absolute inset-0 bg-gray-booked backdrop-blur-sm flex items-center justify-center font-card-title text-primary-white">
        예약마감
      </div>
    );

  const renderChevron = () =>
    !booked && (
      <div className="absolute left-0 right-0 bottom-10 flex items-center justify-between">
        <Chevron variant={variant} onPrev={prev} onNext={next} />
      </div>
    );

  const renderPagination = () =>
    !booked && (
      <div className="absolute bottom-3.5 w-full flex justify-center">
        <PaginationDots total={total} current={current} />
      </div>
    );

  const renderInfo = () => (
    <>
      <div className="flex items-center space-x-2">
        <span className={classNames('font-card-info', booked ? 'text-gray-300' : 'text-gray-400')}>예상 결제 금액</span>
        <span className={classNames('font-card-price-num', booked ? 'text-gray-300' : 'text-primary-black')}>
          {price.toLocaleString()}원
        </span>
      </div>

      <div className="bg-gray-200 w-46 h-0.25 mt-2 mb-2" />

      <div className="flex items-center text-gray-500 space-x-1.5">
        <div
          className={classNames(
            'flex items-center space-x-1.5 font-card-info',
            booked ? 'text-gray-300' : 'text-gray-500'
          )}
        >
          <img src={Location} alt="위치 아이콘" />
          <span>
            {locationText} 도보 {walkTime}
          </span>
        </div>
        <div
          className={classNames(
            'flex items-center space-x-1 font-card-info',
            booked ? 'text-gray-300' : 'text-gray-500'
          )}
        >
          <img src={People} alt="인원 아이콘" />
          <span>권장 인원 {capacity}</span>
        </div>
      </div>
    </>
  );

  const renderAction = () => (
    <Button
      label="예약하기"
      variant={ButtonVariant.Main}
      onClick={() => alert('예약되었습니다!')}
      disabled={booked}
      size={btnsize ?? BtnSizeVariant.XXSM}
    />
  );

  return (
    <div className="w-80 h-65 rounded-xl shadow-card bg-primary-white overflow-hidden">
      {/* 이미지 & 헤더 */}
      <div className="relative min-w-80 h-45 bg-gray-100">
        <img src={images[current]} alt={`slide ${current + 1}`} className="w-full h-full object-cover" />
        {renderHeader()}
        {renderOverlay()}
        {renderChevron()}
        {renderPagination()}
      </div>

      {/* 정보 & 버튼 */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>{renderInfo()}</div>
          {renderAction()}
        </div>
      </div>
    </div>
  );
};

export default Card;
