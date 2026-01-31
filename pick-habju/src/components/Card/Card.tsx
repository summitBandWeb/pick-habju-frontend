import { useState } from 'react';
import classNames from 'classnames';
import Button from '../Button/Button';
import PaginationDots from '../PaginationDot/PaginationDot';
import Chevron from '../Chevron/Chevron';
import People from '../../assets/svg/people.svg';
import ImageCarouselModal from '../Modal/ImageCarouselModal';
import TurnOffIcon from '../../assets/svg/turnOff.svg';
import FaveOff from '../../assets/svg/FaveOff.svg';
import FaveOn from '../../assets/svg/FaveOn.svg';
import type { CardProps } from './Card.types';
import { ChevronVariant } from '../Chevron/ChevronEnums';
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
  initialIndex = 0,
  isLiked = false,
  onBookClick,
  onLike,
}: CardProps) => {
  const [current, setCurrent] = useState(initialIndex);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const total = images.length;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 이미지 로딩 처리 함수
  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  const handleImageError = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index])); // 에러 시에도 로드된 것으로 처리
  };

  const variant: ChevronVariant = booked
    ? ChevronVariant.Middle
    : current === 0
      ? ChevronVariant.First
      : current === total - 1
        ? ChevronVariant.Last
        : ChevronVariant.Middle;

  const prev = () => {
    setCurrent((p) => Math.max(0, p - 1));
  };
  const next = () => {
    setCurrent((p) => Math.min(total - 1, p + 1));
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

  const renderChevron = () =>
    !booked &&
    total > 1 && (
      <div className="absolute left-0 right-0 bottom-10 flex items-center justify-between">
        <Chevron variant={variant} onPrev={prev} onNext={next} />
      </div>
    );

  const renderPagination = () =>
    !booked &&
    total > 1 && (
      <div className="absolute bottom-4.5 w-full flex justify-center">
        <PaginationDots total={total} current={current} />
      </div>
    );

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
      {/* 이미지 & 헤더 */}
      <div className="relative min-w-92.5 h-45 bg-gray-100 cursor-pointer" onClick={() => setIsModalOpen(true)}>
        {/* 이미지 프레임 고정, 내부 레이어만 슬라이드 */}
        <div className="relative w-full h-full overflow-hidden">
          <div
            className="flex h-full"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: 'transform 0.35s ease-out',
            }}
          >
            {images.map((image, index) => {
              const isLoaded = loadedImages.has(index);

              return (
                <div key={index} className="w-full h-full flex-shrink-0 relative">
                  {/* 로딩 플레이스홀더 */}
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"
                        style={{
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 1.5s infinite',
                        }}
                      />
                    </div>
                  )}

                  {/* 실제 이미지 */}
                  <img
                    src={image}
                    alt={`slide ${index + 1}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    fetchPriority={index === 0 ? 'high' : 'low'}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 상단 그라데이션 */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
        {/* 하단 그라데이션 */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        {renderHeader()}
        {renderFloatingButtons()}
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
      {isModalOpen && (
        <ImageCarouselModal
          images={images}
          initialIndex={current}
          onClose={() => setIsModalOpen(false)}
          closeIconSrc={TurnOffIcon}
        />
      )}
    </div>
  );
};

export default Card;
