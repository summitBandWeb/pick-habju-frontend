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

import "swiper/swiper-bundle.css";

const CardCarousel = ({ 
  rooms, 
  selectedRoomId, 
  isOpen, 
  onCardChange 
}: CardCarouselProps) => {
  const isMobile = useMobileDetect();
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

  return (
    <AnimatePresence>
      {isOpen && rooms.length > 0 && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }} // 등장 전: 화면 아래
          animate={{ y: 0, opacity: 1 }}      // 등장 후: 원래 위치
          exit={{ y: "100%", opacity: 0 }}    // 퇴장 시: 다시 아래로
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 w-full pb-8 pointer-events-none"
        >
          {/* 내부 컨테이너: 이벤트 허용 및 중앙 정렬, relative로 설정하여 Chevron의 기준점 잡기 */}
          <div className="pointer-events-auto w-full max-w-[1200px] mx-auto px-4 relative group">
            
            {/* [Custom Chevron] 
              - 모바일이 아닐 때만 표시 (!isMobile)
              - 룸이 1개 초과일 때만 표시 (loop 특성상 1개일 땐 필요 없음)
              - pointer-events-none: 컨테이너가 카드를 가려도 클릭은 통과되도록 설정
            */}
            {!isMobile && rooms.length > 1 && (
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 z-20 px-2 pointer-events-none">
                <Chevron
                  // Loop 모드이므로 항상 양쪽 화살표가 보이는 Middle 타입 사용
                  variant={ChevronVariant.Middle}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  // 내부 버튼만 클릭 가능하도록 설정 ([&>button]은 자식 버튼 태그를 타겟팅)
                  containerClassName="w-full justify-between pointer-events-none [&>button]:pointer-events-auto"
                />
              </div>
            )}

            <Swiper
              modules={[Navigation]}
              spaceBetween={15}
              
              slidesPerView={'auto'}

              centeredSlides={true}
              loop={true} // 무한 루프
              
              // 모바일: 터치 스와이프 O / 데스크탑: 터치 X, 화살표 버튼 O
              allowTouchMove={isMobile}
              navigation={false} // 기본 네비게이션 비활성화 (커스텀 사용)

              onSwiper={setSwiperInstance}
              // 2. [자식 -> 부모] 스와이프해서 카드가 넘어갈 때 selectedRoomId 업데이트
              onSlideChange={(swiper) => {
                // [Loop 모드] realIndex가 실제 데이터 배열의 인덱스
                const currentRoom = rooms[swiper.realIndex];
                if (currentRoom && currentRoom.bizItemId !== selectedRoomId ) {
                  onCardChange(currentRoom.bizItemId);
                }
              }}
              className="w-full h-full !py-8"
            >
              {rooms.map((room) => {
                // 데이터 매핑: RoomMetadata -> Card Props 변환
                const walkTimeCleaned = room.subway?.timeToWalk
                  ?.replace('도보 ', '')
                  ?.replace(' ', '') || '';
                  
                return (
                  <SwiperSlide key={room.bizItemId} className="!w-auto flex justify-center">
                    
                    {({ isActive }) => (
                    <div
                      className={`transform transition-transform duration-300 ${
                        isActive 
                          ? 'scale-105 z-10'  // 중앙이면 1.05배 확대 (원하는 만큼 조절)
                          : 'scale-100' // 나머지는 원래 크기
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
                         // 예약 관련 핸들러나 상태가 필요하면 여기에 추가
                       />
                    </div>)}
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