import Card from '../Card/Card';
import { ROOMS } from '../../constants/data';
import { useSearchStore } from '../../store/search/searchStore';
import { calculateTotalPrice } from '../../utils/calcTotalPrice';
import { useState, useEffect } from 'react';
import BookModalStepper from '../Modal/Book/BookModal';
import ModalOverlay from '../Modal/ModalOverlay.tsx';
import PartialReservationConfirmModal from '../Modal/Portion/PartialReservationConfirmModal';
import OneHourCallReservationNoticeModal from '../Modal/OneHour/OneHourCallReservationNoticeModal';
import CallReservationNoticeModal from '../Modal/Call/CallReservationNoticeModal';
import { formatAvailableTimeRange, extractFirstConsecutiveTrueSlots } from '../../utils/availableTimeFormatter';
import { decideBookModalFlow, decidePartialToNextModalFlow, type ModalType } from '../../utils/modalFlowLogic';
import { getBookingUrl } from '../../utils/bookingUrl';
import DefaultSkeletonView from './DefaultSkeletonView';

const DefaultView = () => {
  const cards = useSearchStore((s) => s.cards);
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [currentModal, setCurrentModal] = useState<{
    type: ModalType;
    cardIdx: number;
    availableTime?: string;
    studioName?: string;
    phoneNumber?: string;
  } | null>(null);

  // 첫 번째 이미지만 프리로딩
  useEffect(() => {
    setImagesLoaded(false);

    if (!cards.length) {
      setImagesLoaded(true);
      return;
    }

    const firstImageUrls = new Set<string>();
    cards.forEach((card) => {
      const room = ROOMS[card.roomIndex];
      // 전체 imageUrls 대신, 첫 번째 이미지만 추가
      if (room.imageUrls && room.imageUrls.length > 0) {
        firstImageUrls.add(room.imageUrls[0]);
      }
    });

    if (firstImageUrls.size === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = firstImageUrls.size;
    let isCancelled = false; // 취소 플래그 추가

    const preloadImage = (url: string) => {
      const img = new Image();
      const onFinish = () => {
        if (isCancelled) return; // 취소된 경우 무시
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      img.onload = onFinish;
      img.onerror = onFinish; // 실패해도 카운트는 올려야 함
      img.src = url;
    };

    Array.from(firstImageUrls).forEach(preloadImage);

    // 5초 후 강제로 이미지 로딩 완료 처리
    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        setImagesLoaded(true);
      }
    }, 5000);

    // 클린업 함수
    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [cards]);

  // 추후 나머지 이미지를 백그라운드에서 로딩하는 새로운 useEffect 추가
  useEffect(() => {
    // 초기 로딩이 완료된 후에만, 그리고 cards 데이터가 있을 때만 실행
    if (!imagesLoaded || !cards.length) {
      return;
    }

    // 나머지 이미지들을 수집
    const remainingImageUrls = new Set<string>();
    cards.forEach((card) => {
      const room = ROOMS[card.roomIndex];
      // 두 번째 이미지부터 끝까지 추가
      if (room.imageUrls && room.imageUrls.length > 1) {
        for (let i = 1; i < room.imageUrls.length; i++) {
          remainingImageUrls.add(room.imageUrls[i]);
        }
      }
    });

    if (remainingImageUrls.size === 0) {
      return;
    }

    // 1초 후에 나머지 이미지 로딩을 시작 (메인 작업에 영향 주지 않기 위함)
    const timer = setTimeout(() => {
      Array.from(remainingImageUrls).forEach((url) => {
        const img = new Image();
        img.src = url; // 로딩만 시키고 완료 여부는 추적할 필요 없음
      });
    }, 1000); // 1초 딜레이

    // 컴포넌트가 언마운트되면 타이머 정리
    return () => clearTimeout(timer);
  }, [imagesLoaded, cards]); // imagesLoaded가 true가 되면 이 useEffect가 실행됨

  // 이미지가 로딩 중이면 스켈레톤 보여주기
  if (!imagesLoaded) {
    return <DefaultSkeletonView />;
  }

  const sorted = [...cards]
    .map((c, idx) => ({ c, idx }))
    .sort((a, b) => {
      const rank = (kind: typeof a.c.kind) => (kind === 'default' ? 0 : kind === 'recommend' ? 1 : 2);
      const ra = rank(a.c.kind);
      const rb = rank(b.c.kind);
      if (ra !== rb) return ra - rb;

      // default 카드들끼리는 총 금액 낮은 순으로 정렬
      if (a.c.kind === 'default' && b.c.kind === 'default' && lastQuery) {
        const roomA = ROOMS[a.c.roomIndex];
        const roomB = ROOMS[b.c.roomIndex];
        const priceA = calculateTotalPrice({
          room: roomA,
          hourSlots: lastQuery.hour_slots,
          peopleCount: lastQuery.peopleCount,
        });
        const priceB = calculateTotalPrice({
          room: roomB,
          hourSlots: lastQuery.hour_slots,
          peopleCount: lastQuery.peopleCount,
        });
        if (priceA !== priceB) return priceA - priceB;
      }

      return a.idx - b.idx; // 안정성 보장
    })
    .map((x) => x.c);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 bg-[#FFFBF0]">
      {sorted.map((c, i) => {
        const room = ROOMS[c.roomIndex];
        const images = room.imageUrls;
        const price = lastQuery
          ? calculateTotalPrice({ room, hourSlots: lastQuery.hour_slots, peopleCount: lastQuery.peopleCount })
          : room.pricePerHour;
        const locationText = room.subway.station;
        const walkTime = room.subway.timeToWalk.replace('도보 ', '').replace(' ', '');
        const capacity = `${room.recommendCapacity}인`;

        if (c.kind === 'open') {
          return (
            <Card
              key={`${c.kind}-${room.bizItemId}-${i}`}
              images={images}
              title={room.branch}
              subtitle={room.name}
              price={price}
              locationText={locationText}
              walkTime={walkTime}
              capacity={capacity}
              booked
              reOpenDaysFromNow={c.reOpenDaysFromNow}
            />
          );
        }

        if (c.kind === 'recommend') {
          return (
            <Card
              key={`${c.kind}-${room.bizItemId}-${i}`}
              images={images}
              title={room.branch}
              subtitle={room.name}
              price={price}
              locationText={locationText}
              walkTime={walkTime}
              capacity={capacity}
              partialAvailable
              onBookClick={() => {
                if (!lastQuery || !c.availableSlots) return;
                const availableTime = formatAvailableTimeRange(c.availableSlots);
                setCurrentModal({
                  type: 'partial',
                  cardIdx: i,
                  availableTime,
                });
              }}
            />
          );
        }

        return (
          <div key={`${c.kind}-${room.bizItemId}-${i}`} className="relative">
            <Card
              images={images}
              title={room.branch}
              subtitle={room.name}
              price={price}
              locationText={locationText}
              walkTime={walkTime}
              capacity={capacity}
              onBookClick={() => {
                if (!lastQuery) return;
                const decision = decideBookModalFlow({
                  room,
                  dateIso: lastQuery.date,
                  hourSlots: lastQuery.hour_slots,
                });

                if (decision.modalType === 'book') {
                  setOpenIdx(i);
                } else {
                  setCurrentModal({
                    type: decision.modalType,
                    cardIdx: i,
                    studioName: decision.studioName,
                    phoneNumber: decision.phoneNumber,
                  });
                }
              }}
            />
            {openIdx === i && lastQuery && (
              <ModalOverlay open onClose={() => setOpenIdx(null)}>
                <div className="w-full max-w-[25.9375rem]" onClick={(e) => e.stopPropagation()}>
                  <BookModalStepper
                    room={room}
                    dateIso={lastQuery.date}
                    hourSlots={lastQuery.hour_slots}
                    peopleCount={lastQuery.peopleCount}
                    finalTotalFromCard={price}
                    onConfirm={() => {
                      setOpenIdx(null);
                    }}
                    onClose={() => setOpenIdx(null)}
                  />
                </div>
              </ModalOverlay>
            )}
          </div>
        );
      })}

      {/* 모달들 */}
      {currentModal &&
        lastQuery &&
        (() => {
          const selectedCard = sorted[currentModal.cardIdx];
          const selectedRoom = ROOMS[selectedCard.roomIndex];
          // const selectedPrice = calculateTotalPrice({
          //   room: selectedRoom,
          //   hourSlots: lastQuery.hour_slots,
          //   peopleCount: lastQuery.peopleCount
          // });

          const closeModal = () => setCurrentModal(null);

          switch (currentModal.type) {
            case 'partial':
              return (
                <PartialReservationConfirmModal
                  open
                  onClose={closeModal}
                  availableTime={currentModal.availableTime || ''}
                  onConfirm={() => {
                    // 부분 예약 확인 후 다음 모달 결정
                    if (!selectedCard.availableSlots) {
                      closeModal();
                      return;
                    }

                    // 연속된 true 구간에서 시간 슬롯 추출 (첫 번째 구간만 사용)
                    const recommendedSlots = extractFirstConsecutiveTrueSlots(selectedCard.availableSlots);

                    const nextDecision = decidePartialToNextModalFlow({
                      room: selectedRoom,
                      dateIso: lastQuery.date,
                      recommendedHourSlots: recommendedSlots,
                    });

                    if (nextDecision.modalType === 'book') {
                      // 직접 URL로 이동
                      window.open(getBookingUrl(selectedRoom, lastQuery.date), '_blank');
                      closeModal();
                    } else {
                      setCurrentModal({
                        type: nextDecision.modalType,
                        cardIdx: currentModal.cardIdx,
                        studioName: nextDecision.studioName,
                        phoneNumber: nextDecision.phoneNumber,
                      });
                    }
                  }}
                />
              );

            case 'oneHourCall':
              return (
                <OneHourCallReservationNoticeModal
                  open
                  onClose={closeModal}
                  studioName={currentModal.studioName || ''}
                  phoneNumber={currentModal.phoneNumber || ''}
                  onConfirm={() => {
                    window.open(getBookingUrl(selectedRoom, lastQuery.date), '_blank');
                    closeModal();
                  }}
                />
              );

            case 'sameDayCall':
              return (
                <ModalOverlay open onClose={closeModal}>
                  <div className="w-full max-w-[25.9375rem]" onClick={(e) => e.stopPropagation()}>
                    <CallReservationNoticeModal
                      open
                      onClose={closeModal}
                      studioName={currentModal.studioName || ''}
                      phoneNumber={currentModal.phoneNumber || ''}
                    />
                  </div>
                </ModalOverlay>
              );

            default:
              return null;
          }
        })()}
    </div>
  );
};

export default DefaultView;
