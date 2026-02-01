/**
 * Card 컴포넌트
 * - 공간 카드 UI (이미지, 제목, 가격, 권장 인원, 예약/오픈대기 버튼)
 * - 이미지 개수에 따라 1장/2장/3장 이상 그리드 레이아웃
 * - 이미지 영역 클릭 시 상세 이미지 모달(ImageCarouselModal) 오픈
 */
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

/** 카드 이미지 그리드 좌우 비율 (13.75rem : 7.875rem ≈ 1.746 : 1) - 카드 너비가 줄어들어도 비율 유지 */
const IMAGE_GRID_COLS = 'grid-cols-[1.746fr_minmax(0,1fr)]';

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
  // 로딩된 이미지 인덱스 집합 ( shimmer 플레이스홀더 → 실제 이미지 전환용)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const total = images.length;
  // 상세 이미지 모달 열림 여부
  const [isModalOpen, setIsModalOpen] = useState(false);

  /** 이미지 로드 완료 시 플레이스홀더 제거 */
  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  /** 이미지 로드 실패 시에도 플레이스홀더 제거 (빈 칸 방지) */
  const handleImageError = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  /** 이미지 영역 클릭 → 상세 이미지 모달 오픈 (첫 번째 이미지부터) */
  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  /** 즐겨찾기 버튼 클릭, 이벤트 버블링 차단 */
  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onLike?.();
  };

  // ---------- 이미지 영역 위 UI (헤더, 오버레이, 플로팅 버튼) ----------

  /** 이미지 위 좌측: 제목·부제목 */
  const renderHeader = () => (
    <div className="absolute top-6 left-4 flex items-start space-x-[9px] text-primary-white">
      <div className="w-0.5 h-12.5 bg-white/90" />
      <div className="space-y-1">
        <p className="font-card-title text-shadow-md">{title}</p>
        <p className="font-card-title text-shadow-md">{subtitle}</p>
      </div>
    </div>
  );

  /** 예약 마감(booked) 시 이미지 전체 덮는 오버레이 + 재오픈 예정일 문구 */
  const renderOverlay = () =>
    booked && (
      <div className="absolute inset-0 bg-gray-booked text-primary-white">
        <div className="absolute top-6 left-4 flex items-start space-x-[9px]">
          <div className="w-0.5 h-12.5 bg-white" />
          <div className="space-y-1">
            <p className="font-card-title">{title}</p>
            <p className="font-card-title">{getReopenText()}</p>
          </div>
        </div>
      </div>
    );

  /** 예약 재오픈 예정일 텍스트 (reOpenDaysFromNow일 뒤 날짜) */
  const getReopenText = (): string => {
    const base = new Date();
    base.setDate(base.getDate() + reOpenDaysFromNow);
    const month = base.getMonth() + 1;
    const day = base.getDate();
    return `${month}/${day}부터 예약가능합니다`;
  };

  /** 이미지 우측 상단: 즐겨찾기 버튼 (예약 가능할 때만) */
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

  /**
   * 이미지 한 칸 렌더 (로딩 전 shimmer, 로드 후 이미지)
   * @param className - 레이아웃용 (w-full h-full, flex-1 등)
   */
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

  /**
   * 이미지 개수별 그리드 레이아웃
   * - 1장: 전체
   * - 2장: 좌(~63.6%) | 우(~36.4%) 비율 유지
   * - 3장 이상: 좌(1장) | 우(위·아래 2장), 4장 이상이면 세 번째 칸에 4+ 오버레이
   */
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
          className={`absolute inset-0 grid ${IMAGE_GRID_COLS} cursor-pointer`}
          onClick={handleImageClick}
        >
          {renderImageCell(images[0], 0, 'min-w-0 h-full')}
          {renderImageCell(images[1], 1, 'min-w-0 h-full')}
        </div>
      );
    }

    // 3장 이상: 왼쪽 1장 + 오른쪽 2장 세로 배치, 4장 이상일 때만 세 번째 이미지에 4+ 오버레이
    return (
      <div
        className={`absolute inset-0 grid ${IMAGE_GRID_COLS} cursor-pointer`}
        onClick={handleImageClick}
      >
        <div className="min-w-0 h-full overflow-hidden">{renderImageCell(images[0], 0, 'w-full h-full')}</div>
        <div className="min-w-0 min-h-0 h-full overflow-hidden grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-h-0 overflow-hidden">
            {renderImageCell(images[1], 1, 'w-full h-full')}
          </div>
          <div className="relative min-h-0 overflow-hidden">
            {renderImageCell(images[2], 2, 'w-full h-full')}
            {/* 4장 이상: 세 번째 칸 위에 반투명 + ImgIcon + "4+" 텍스트 */}
            {total >= 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col justify-between items-center h-6">
                  <img src={ImgIcon} alt="" />
                  <div className="flex justify-center items-center self-stretch px-[0.3125rem] gap-[0.125rem] font-summary">
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

  /** 카드 하단 정보: 예상 결제 금액, 구분선, 권장 인원 */
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

  /** 예약하기 / 추천시간 / 오픈대기 버튼 (booked면 비활성 + 오픈대기) */
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
        <div className="w-86.5 h-60.5 rounded-xl shadow-card bg-primary-white overflow-hidden">
      {/* 이미지 영역: 그리드 + 그라데이션 + 헤더/즐겨찾기/오버레이 */}
            <div className="relative w-full h-40.75 bg-gray-100 overflow-hidden">
        {renderImages()}

        {/* 상단 그라데이션 */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
        {/* 하단 그라데이션 */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
        {renderHeader()}
        {renderFloatingButtons()}
        {renderOverlay()}
      </div>

      {/* 하단: 예상 금액, 권장 인원, CTA 버튼 */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>{renderInfo()}</div>
          {renderAction()}
        </div>
      </div>

      {/* 이미지 영역 클릭 시 상세 이미지 모달 (첫 장부터) */}
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
