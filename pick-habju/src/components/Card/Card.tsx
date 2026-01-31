import { useState } from 'react';
import classNames from 'classnames';
import Button from '../Button/Button';
import People from '../../assets/svg/people.svg';
import ImageCarouselModal from '../Modal/ImageCarouselModal';
import TurnOffIcon from '../../assets/svg/turnOff.svg';
import FaveOff from '../../assets/svg/FaveOff.svg';
import FaveOn from '../../assets/svg/FaveOn.svg';
import ImgIcon from '../../assets/svg/ImgIcon.svg';
import type { CardProps } from './Card.types';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import { pushGtmEvent } from '../../utils/gtm';

const Card = ({
  images,
  title,
  subtitle,
  price,
  capacity,
  booked = false,
  partialAvailable = false,
  reOpenDaysFromNow = 90,
  btnsize,
  isLiked = false,
  onBookClick,
  onLike,
}: CardProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const total = images.length;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  const handleImageError = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onLike?.();
  };

  // 렌더 함수 분리

  const renderHeader = () => (
    <div className="absolute top-6 left-4 flex items-start space-x-[9px] text-primary-white">
      <div className="w-0.5 h-12.5 bg-white/90" />
      <div className="space-y-1">
        <p className="font-card-title text-shadow-md">{title}</p>
        <p className="font-card-title text-shadow-md">{subtitle}</p>
      </div>
    </div>
  );

  const renderOverlay = () =>
    booked && (
      <div className="absolute inset-0 bg-gray-booked text-primary-white">
        {/* 헤더 스타일 차용 */}
        <div className="absolute top-6 left-4 flex items-start space-x-[9px]">
          <div className="w-0.5 h-12.5 bg-white" />
          <div className="space-y-1">
            <p className="font-card-title">{title}</p>
            <p className="font-card-title">{getReopenText()}</p>
          </div>
        </div>
        {/* 중앙 메시지는 제거하고 헤더만 노출 */}
      </div>
    );

  const getReopenText = (): string => {
    const base = new Date();
    base.setDate(base.getDate() + reOpenDaysFromNow);
    const month = base.getMonth() + 1;
    const day = base.getDate();
    return `${month}/${day}부터 예약가능합니다`;
  };

  const renderFloatingButtons = () => (
    <div className="absolute top-6 right-4 z-30 flex flex-col items-center gap-2.5">
      {!booked && (
        <button
          type="button"
          onClick={handleLikeClick}
          className="hover:opacity-80 transition-opacity"
        >
          <img
            src={isLiked ? FaveOn : FaveOff}
            alt={isLiked ? '즐겨찾기 해제' : '즐겨찾기'}
            className="w-5 h-5"
          />
        </button>
      )}
    </div>
  );

  const renderImageCell = (image: string, index: number, className?: string) => {
    const isLoaded = loadedImages.has(index);
    return (
      <div key={index} className={classNames('relative overflow-hidden', className)}>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200">
            <div
              className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
              style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }}
            />
          </div>
        )}
        <img
          src={image}
          alt={`slide ${index + 1}`}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={() => handleImageLoad(index)}
          onError={() => handleImageError(index)}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
    );
  };

  const renderImages = () => {
    if (total === 0) return null;
    if (total === 1) {
      return (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={handleImageClick}
        >
          {renderImageCell(images[0], 0, 'w-full h-full')}
        </div>
      );
    }
    if (total === 2) {
      return (
        <div
          className="absolute inset-0 flex cursor-pointer"
          onClick={handleImageClick}
        >
          {renderImageCell(images[0], 0, 'w-[13.75rem] shrink-0 h-full')}
          {renderImageCell(images[1], 1, 'flex-1 h-full')}
        </div>
      );
    }
    // 3장 이상: 왼쪽 1장 + 오른쪽 2장, 4장 이상일 때만 세 번째 이미지에 4+ 오버레이
    return (
      <div
        className="absolute inset-0 flex cursor-pointer"
        onClick={handleImageClick}
      >
        <div className="w-[13.75rem] shrink-0 h-full">{renderImageCell(images[0], 0, 'w-full h-full')}</div>
        <div className="flex-1 min-w-0 min-h-0 h-full flex flex-col">
          {renderImageCell(images[1], 1, 'w-full flex-1 min-h-0')}
          <div className="relative flex-1 min-h-0">
            {renderImageCell(images[2], 2, 'w-full h-full')}
            {/* 4장 이상일 때 추가 레이아웃, 4+ 이미지 아이콘 노출 */}
            {total >= 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col justify-between items-center h-6">
                  <img src={ImgIcon} alt="" />
                  <div
                    className="flex justify-center items-center self-stretch px-[0.3125rem] gap-[0.125rem]"
                    style={{ fontFamily: 'Inter', fontSize: '0.6875rem' }}
                  >
                    <span className="text-primary-white font-medium leading-none">4</span>
                    <span className="text-primary-white font-medium leading-none">+</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderInfo = () => (
    <>
      {!partialAvailable ? (
        <div className="flex items-center space-x-2">
          <span className={classNames('font-card-info', booked ? 'text-gray-300' : 'text-gray-400')}>
            예상 결제 금액
          </span>
          {booked ? (
            <span className={classNames('font-card-price-num', 'text-gray-300')}>N원</span>
          ) : (
            <span className={classNames('font-card-price-num', 'text-primary-black')}>{price.toLocaleString()}원</span>
          )}
        </div>
      ) : (
        <div className="font-card-partial">선택하신 시간 중 일부만 가능합니다</div>
      )}

      <div className="bg-gray-200 w-46 h-0.25 mt-2 mb-2" />

      <div className="flex items-center text-gray-500 space-x-1.5">
        <div
          className={classNames(
            'flex items-center space-x-1 font-card-info whitespace-nowrap',
            booked ? 'text-gray-300' : 'text-gray-400'
          )}
        >
          <img src={People} alt="인원 아이콘" />
          <span>권장 인원 {booked ? 'N인' : capacity}</span>
        </div>
      </div>
    </>
  );

  const renderAction = () => (
    <Button
      label={booked ? '오픈대기' : partialAvailable ? '추천시간' : '예약하기'}
      variant={ButtonVariant.Main}
      onClick={() => {
        const actionType = booked ? '오픈대기' : partialAvailable ? '추천시간' : '예약하기';
        pushGtmEvent('card_action_click', { action_type: actionType });
        onBookClick?.();
      }}
      disabled={booked}
      size={btnsize ?? BtnSizeVariant.XXSM}
    />
  );

  return (
    <div className="w-92.5 h-65 rounded-xl shadow-card bg-primary-white overflow-hidden">
      <div className="relative min-w-92.5 h-45 bg-gray-100 overflow-hidden">
        {renderImages()}

        {/* 상단 그라데이션 */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
        {/* 하단 그라데이션 */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        {renderHeader()}
        {renderFloatingButtons()}
        {renderOverlay()}
      </div>

      {/* 정보 & 버튼 */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>{renderInfo()}</div>
          {renderAction()}
        </div>
      </div>
      {isModalOpen && (
        <ImageCarouselModal
          images={images}
          onClose={() => setIsModalOpen(false)}
          closeIconSrc={TurnOffIcon}
        />
      )}
    </div>
  );
};

export default Card;
