import Button from '../Button/Button';
import { ButtonVariant, BtnSizeVariant, ChevronVariant } from '../../enums/components';
import PaginationDots from '../PaginationDot/PaginationDot';
import Chevron from '../Chevron/Chevron';
import { useState } from 'react';
import Location from '../../assets/svg/location.svg';
import People from '../../assets/svg/people.svg';
import classNames from 'classnames';
import type { CardProps } from './Card.types';

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

  // Chevron variant 판별
  const variant: ChevronVariant = booked
    ? ChevronVariant.Middle
    : current === 0
      ? ChevronVariant.First
      : current === total - 1
        ? ChevronVariant.Last
        : ChevronVariant.Middle;

  const prev = () => setCurrent((p) => Math.max(0, p - 1));
  const next = () => setCurrent((p) => Math.min(total - 1, p + 1));

  return (
    <div className="w-full min-w-[320px] min-h-[260px] rounded-[10px] shadow-card bg-primary-white overflow-hidden">
      <div className="relative min-w-[320px] h-[180px] bg-gray-100">
        <img src={images[current]} alt={`slide ${current + 1}`} className="w-full h-full object-cover" />

        <div className="absolute top-6 left-4 flex items-start space-x-[9px] text-primary-white">
          {/* 세로 막대 */}
          <div className="w-[2px] h-[50px] bg-white" />

          {/* 텍스트 */}
          <div className="space-y-1">
            <p className="font-card-title">{title}</p>
            <p className="font-card-title">{subtitle}</p>
          </div>
        </div>

        {/* 예약마감 오버레이 */}
        {booked && (
          <div className="absolute inset-0 bg-[#282828]/70 backdrop-blur-sm flex items-center justify-center font-card-title text-primary-white">
            예약마감
          </div>
        )}

        {/* 화살표: booked 시 렌더링하지 않음 */}
        {!booked && (
          <div className="absolute left-0 right-0 bottom-10 flex items-center justify-between">
            <Chevron variant={variant} onPrev={prev} onNext={next} />
          </div>
        )}

        {/* 페이지 점 */}
        {!booked && (
          <div className="absolute bottom-[14px] w-full flex justify-center">
            <PaginationDots total={total} current={current} />
          </div>
        )}
      </div>

      {/* 정보·버튼 영역 */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="space-x-1.5">
              <span className={classNames('font-card-info', booked ? 'text-gray-300' : 'text-gray-400')}>
                예상 결제 금액
              </span>
              <span className={classNames('font-card-pricenum', booked ? 'text-gray-300' : 'text-primary-black')}>
                {price.toLocaleString()}원
              </span>
            </div>

            <div className="bg-gray-200 w-[186px] h-[1px] mt-2 mb-2"></div>

            <div className="flex items-center text-gray-500 space-x-[6px]">
              <div
                className={classNames(
                  'flex items-center space-x-[6px] font-card-info',
                  booked ? 'text-gray-300' : 'text-gray-500'
                )}
              >
                <img src={Location} alt="위치 아이콘" />
                <span>
                  {locationText} 도보 {walkTime}
                </span>
              </div>
              <div>
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
            </div>
          </div>
          <Button
            label="예약하기"
            variant={ButtonVariant.Main}
            onClick={() => alert('예약되었습니다!')}
            disabled={booked}
            size={btnsize ? btnsize : BtnSizeVariant.XSM}
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Card;
