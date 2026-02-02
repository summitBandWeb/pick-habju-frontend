import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';

import type { CardCarouselProps } from './CardCarousel.types';
import type { RoomMetadata } from '../../types/RoomMetadata';
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

/** 슬라이드 한 장: RoomMetadata → Card 렌더, 모바일 활성 슬라이드 시 scale */
function CarouselSlideContent({
  room,
  isActive,
  isMobile,
  isDesktop,
}: {
  room: RoomMetadata;
  isActive: boolean;
  isMobile: boolean;
  isDesktop: boolean;
}) {
  const shouldScale = isMobile && isActive;

  return (
    <div className={isDesktop ? 'w-full flex justify-center' : 'flex justify-center'}>
      <div
        className={`transform transition-transform duration-300 ${
          shouldScale ? 'scale-105 z-10' : 'scale-100'
        }`}
      >
        <Card
          images={room.imageUrls}
          title={room.branch}
          subtitle={room.name}
          price={room.pricePerHour}
          capacity={`${room.recommendCapacity}인`}
        />
      </div>
    </div>
  );
}

const CardCarousel = ({ rooms, selectedRoomId, isOpen, onCardChange, forceDevice }: CardCarouselProps) => {
  const detectedMobile = useMobileDetect();
  const isMobile = forceDevice ? forceDevice === 'mobile' : detectedMobile;
  const isDesktop = !isMobile;

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  /** 지도 핀 클릭(selectedRoomId 변경) 시 해당 슬라이드로 동기화. Loop 모드이므로 slideToLoop 사용 */
  useEffect(() => {
    if (swiperInstance && selectedRoomId && isOpen && rooms.length > 0) {
      const index = rooms.findIndex((room) => room.bizItemId === selectedRoomId);
      if (index !== -1 && swiperInstance.realIndex !== index) {
        swiperInstance.slideToLoop(index);
      }
    }
  }, [selectedRoomId, isOpen, swiperInstance, rooms]);

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    // [L1] 조건부 마운트 + 등장/퇴장 애니메이션
    <AnimatePresence>
      {(isOpen && rooms.length > 0) && (
        <>
          {/* 그라데이션: 화면 하단 고정 (애니메이션과 분리해 간격 방지) */}
          <motion.div
            key="carousel-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 left-0 right-0 z-40 h-48 w-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(217, 217, 217, 0) 0%, rgba(29, 20, 20, 0.8) 100%)',
          }}
          aria-hidden="true"
        />

          {/* [L2] 고정 위치 오버레이 (하단 풀폭, z-50, 등장 시 아래→위 슬라이드) */}
          <motion.div
            key="carousel-content"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 w-full pb-8 pointer-events-none"
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
              onSwiper={setSwiperInstance}
              {...getSwiperProps(isDesktop)}
              onSlideChange={(swiper) => {
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
                    <CarouselSlideContent
                      room={room}
                      isActive={isActive}
                      isMobile={isMobile}
                      isDesktop={isDesktop}
                    />
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
