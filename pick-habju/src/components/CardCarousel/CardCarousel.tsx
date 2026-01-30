import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';

import type { CardCarouselProps } from './CardCarousel.types';
import { useMobileDetect } from '../../hook/useMobileDetect';
import Card from '../Card/Card';
import Chevron from '../Chevron/Chevron';
import { ChevronVariant } from '../Chevron/ChevronEnums';

import 'swiper/swiper-bundle.css';

const CardCarousel = ({ rooms, selectedRoomId, isOpen, onCardChange, forceDevice }: CardCarouselProps) => {
  const detectedMobile = useMobileDetect();
  const isMobile = forceDevice ? forceDevice === 'mobile' : detectedMobile;

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  // 1. 지도 핀 클릭(selectedRoomId 변경) 시 -> 해당 슬라이드로 이동
  useEffect(() => {
    if (swiperInstance && selectedRoomId && isOpen && rooms.length > 0) {
      // bizItemId로 인덱스 찾기
      const index = rooms.findIndex((room) => room.bizItemId === selectedRoomId);
      //"찾은 인덱스"와 "현재 인덱스"가 다를 때만 이동함 - 무한 반복 방지
      if (index !== -1 && swiperInstance.realIndex !== index) {
        // [Loop 모드] loop일 때는 slideToLoop를 써야 정확한 위치로 이동함
        swiperInstance.slideToLoop(index);
      }
    }
  }, [selectedRoomId, isOpen, swiperInstance, rooms]);

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  // 데스크탑 전용 Swiper 옵션 분기. 데스크탑일 때 slidesPerView=1, centeredSlides=false, slides는 w-full로 고정, 터치 불가

  const isDesktop = !isMobile;

  const swiperProps = isDesktop
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

  return (
    <AnimatePresence>
      {isOpen && rooms.length > 0 && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }} // 등장 전: 화면 아래
          animate={{ y: 0, opacity: 1 }} // 등장 후: 원래 위치
          exit={{ y: '100%', opacity: 0 }} // 퇴장 시: 다시 아래로
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 w-full pb-8 pointer-events-none"
        >
          {/* ✅ 카드 프레임: 데스크탑은 카드 1장 폭, 모바일은 full. relative로 설정하여 Chevron의 기준점잡음 */}
          <div
            className={
              isDesktop
                ? 'relative mx-auto w-100.5 overflow-visible pointer-events-auto'
                : 'relative w-full pointer-events-auto'
            }
          >
            {/* ✅ Chevron 이 프레임 기준으로 양옆에 */}
            {isDesktop && rooms.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between pointer-events-none">
                <Chevron
                  variant={ChevronVariant.Middle}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  containerClassName="
            w-full justify-between pointer-events-none
            [&>button]:pointer-events-auto
            [&>button:first-child]:-translate-x-10
            [&>button:last-child]:translate-x-10
            [&_path]:text-gray-400
          "
                />
              </div>
            )}

            <Swiper
              modules={[Navigation]}
              loop={true} // 무한 루프
              navigation={false} // 기본 네비게이션 비활성화 (커스텀 사용)
              onSwiper={setSwiperInstance}
              {...swiperProps}
              // 2. [자식 -> 부모] 스와이프해서 카드가 넘어갈 때 selectedRoomId 업데이트
              onSlideChange={(swiper) => {
                // [Loop 모드] realIndex가 실제 데이터 배열의 인덱스
                const currentRoom = rooms[swiper.realIndex];
                if (currentRoom && currentRoom.bizItemId !== selectedRoomId) {
                  onCardChange(currentRoom.bizItemId);
                }
              }}
              className="w-full h-full !py-8"
            >
              {rooms.map((room) => {
                // 데이터 매핑: RoomMetadata -> Card Props 변환
                const walkTimeCleaned = room.subway?.timeToWalk?.replace('도보 ', '')?.replace(' ', '') || '';

                return (
                  //데스크탑은 무조건 카드 한 장이 꽉 차야 하므로 SwiperSlide 폭 분기
                  <SwiperSlide key={room.bizItemId} className={isDesktop ? '!w-full' : '!w-auto'}>
                    {({ isActive }: { isActive: boolean }) => {
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
                              locationText={room.subway?.station}
                              walkTime={walkTimeCleaned}
                              capacity={`${room.recommendCapacity}인`}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardCarousel;
