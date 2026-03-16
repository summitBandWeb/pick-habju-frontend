import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';

import type { CardCarouselProps, CardCarouselRoom } from './CardCarousel.types';
import type { CardProps } from '../Card/Card.types';
import { useMobileDetect } from '../../hook/useMobileDetect';
import Card from '../Card/Card';
import Chevron from '../Chevron/Chevron';
import { ChevronVariant } from '../Chevron/ChevronEnums';

import 'swiper/css';

/** Chevron 컨테이너 스타일: nested 선택자 분리로 가독성 향상 */
const CHEVRON_CONTAINER_STYLES = `
  w-full justify-between pointer-events-none
  [&>button]:pointer-events-auto
  [&>button:first-child]:-translate-x-7.5
  [&>button:last-child]:translate-x-7.5
  [&_path]:text-gray-400
`;

/** 데스크탑/모바일 Swiper 옵션 (디바이스별 분기) */
const getSwiperProps = (isDesktop: boolean) =>
  isDesktop
    ? {
        slidesPerView: 1 as const,
        centeredSlides: false,
        spaceBetween: 15,
        allowTouchMove: false,
      }
    : {
        slidesPerView: 'auto' as const,
        centeredSlides: true,
        spaceBetween: 15,
        allowTouchMove: true,
      };

/** 슬라이드 한 장: CardCarouselRoom -> Card 렌더, 모바일 활성 슬라이드 시 scale */
function CarouselSlideContent({
  room,
  isActive,
  isMobile,
  isDesktop,
  onBookClick,
}: {
  room: CardCarouselRoom;
  isActive: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  onBookClick: (bizItemId: string) => void;
}) {
  const shouldScale = isMobile && isActive;

  const cardProps: CardProps = {
    images: room.imageUrls,
    title: room.branch,
    subtitle: room.name,
    price: room.partialAvailable ? room.pricePerHour : room.estimatedPrice,
    partialAvailable: room.partialAvailable,
    capacity: `${room.recommendCapacityRange[0]}~${room.recommendCapacityRange[1]}인`,
    bizItemId: room.bizItemId,
    businessId: room.businessId,
    availableTimeRange: room.availableTimeRange,
    onBookClick: () => onBookClick(room.bizItemId),
  };

  return (
    <div className={isDesktop ? 'w-full flex justify-center' : 'flex justify-center'}>
      <div className={`transform transition-transform duration-300 ${shouldScale ? 'scale-105 z-10' : 'scale-100'}`}>
        <Card {...cardProps} />
      </div>
    </div>
  );
}

/**
 * 검색 결과 룸 목록을 하단 슬라이딩 오버레이로 표시하는 캐러셀.
 * - selectedRoomId 변경 시 해당 슬라이드로 자동 이동 (slideToLoop).
 * - 사용자 스와이프 시 onCardChange로 선택 룸 ID를 상위에 전달.
 * - isOpen / rooms.length에 따라 AnimatePresence로 슬라이드 인·아웃 처리.
 */
const CardCarousel = ({ rooms, selectedRoomId, isOpen, onCardChange, onBookClick, forceDevice }: CardCarouselProps) => {
  const detectedMobile = useMobileDetect();
  const isMobile = forceDevice ? forceDevice === 'mobile' : detectedMobile;
  const isDesktop = !isMobile;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  /** Swiper loop 초기화 중 발생하는 spurious onSlideChange를 무시하기 위한 flag.
   *  onSwiper(마운트)에서 false로 리셋, 첫 슬라이드 동기화 완료 후 true로 전환한다. */
  const isSwipeReadyRef = useRef(false);

  /** Swiper가 (재)마운트될 때마다 준비 flag를 리셋하고 인스턴스를 저장 */
  const handleSwiper = (swiper: SwiperType) => {
    isSwipeReadyRef.current = false;
    setSwiperInstance(swiper);
  };

  /** 지도 핀 클릭(selectedRoomId 변경) 시 해당 슬라이드로 동기화. Loop 모드이므로 slideToLoop 사용 */
  useEffect(() => {
    if (swiperInstance && selectedRoomId && isOpen && rooms.length > 0) {
      const index = rooms.findIndex((room) => room.bizItemId === selectedRoomId);
      if (index !== -1) {
        if (swiperInstance.realIndex !== index) {
          swiperInstance.slideToLoop(index);
        }
      }
      isSwipeReadyRef.current = true;
    }
  }, [selectedRoomId, isOpen, swiperInstance, rooms]);

  /** Swiper 마운트 시점의 selectedRoomId 기반 초기 슬라이드 인덱스.
   *  Swiper는 initialSlide를 마운트 시에만 사용하므로 매 render마다 계산해도 안전하다. */
  const initialSlide = selectedRoomId
    ? Math.max(
        rooms.findIndex((room) => room.bizItemId === selectedRoomId),
        0
      )
    : 0;

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    // [L1] 조건부 마운트 + 등장/퇴장 애니메이션
    <AnimatePresence>
      {isOpen && rooms.length > 0 && (
        <>
          {/* [L2] 고정 위치 오버레이 (하단 풀폭, z-50, 등장 시 아래→위 슬라이드) */}
          <motion.div
            key="carousel-content"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute left-0 right-0 z-50 w-full pb-2 pointer-events-none"
            style={{ bottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* [L3] 카드 영역 프레임: 데스크탑 1장 폭 + 그림자 들어갈 간격 (w-92.5), 모바일 풀폭. relative로 Chevron 기준점 제공 */}
            <div
              className={
                isDesktop
                  ? 'relative z-10 mx-auto w-92.5 overflow-visible pointer-events-auto'
                  : 'relative z-10 w-full pointer-events-auto'
              }
            >
              {/* [L4] 데스크탑 전용: Chevron 좌우 네비게이션 (프레임 기준 absolute) */}
              {isDesktop && rooms.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between pointer-events-none">
                  <Chevron
                    variant={ChevronVariant.Middle}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    containerClassName={CHEVRON_CONTAINER_STYLES}
                  />
                </div>
              )}

              {/* [L5] Swiper 캐러셀: 루프, 디바이스별 옵션, 슬라이드 변경 시 onCardChange로 부모에 알림 */}
              <Swiper
                role="region"
                aria-label="룸 카드 캐러셀"
                modules={[Navigation]}
                loop={true}
                navigation={false}
                initialSlide={initialSlide}
                onSwiper={handleSwiper}
                {...getSwiperProps(isDesktop)}
                onSlideChange={(swiper) => {
                  if (!isSwipeReadyRef.current) return;
                  const currentRoom = rooms[swiper.realIndex];
                  if (currentRoom && currentRoom.bizItemId !== selectedRoomId) {
                    onCardChange(currentRoom.bizItemId);
                  }
                }}
                className="w-full h-full !py-8"
              >
                {rooms.map((room) => (
                  // [L6] 슬라이드 래퍼: 데스크탑 !w-full(1장 꽉 참), 모바일 !w-auto
                  <SwiperSlide key={room.bizItemId} className={isDesktop ? '!w-full' : '!w-auto'}>
                    {({ isActive }: { isActive: boolean }) => (
                      <CarouselSlideContent room={room} isActive={isActive} isMobile={isMobile} isDesktop={isDesktop} onBookClick={onBookClick} />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CardCarousel;
