import Card from '../Card/Card';
import { ROOMS } from '../../constants/data';
import { useSearchStore } from '../../store/search/searchStore';
import { calculateTotalPrice } from '../../utils/calcTotalPrice';
import { useState } from 'react';
import BookModalStepper from '../Modal/Book/BookModal';
import ModalOverlay from '../Modal/ModalOverlay.tsx';
import PartialReservationConfirmModal from '../Modal/Portion/PartialReservationConfirmModal';
import OneHourCallReservationNoticeModal from '../Modal/OneHour/OneHourCallReservationNoticeModal';
import OneHourChatReservationNoticeModal from '../Modal/OneHour/OneHourChatReservationNoticeModal';
import CallReservationNoticeModal from '../Modal/Call/CallReservationNoticeModal';
import { formatAvailableTimeRange, extractFirstConsecutiveTrueSlots } from '../../utils/availableTimeFormatter';
import { decideBookModalFlow, decidePartialToNextModalFlow, type ModalType } from '../../utils/modalFlowLogic';
import { getBookingUrl } from '../../utils/bookingUrl';
import { CardKind } from '../../store/search/searchStore.types';
import NoSearchResult from '../NoSearchResult/NoSearchResult';

const DefaultView = () => {
  const filteredCards = useSearchStore((s) => s.filteredCards);
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [currentModal, setCurrentModal] = useState<{
    type: ModalType;
    cardIdx: number;
    availableTime?: string;
    studioName?: string;
    phoneNumber?: string;
  } | null>(null);

  // 검색 결과가 없을 때 NoResultView 표시 - 추후 변경 필요할듯 ?
  if (filteredCards.length === 0) {
    return <NoSearchResult />;
  }

  // filteredCards는 이미 HomePage에서 정렬된 상태이므로 순서를 유지합니다
  const sorted = [...filteredCards];

  // TODO: 즐겨찾기 기능 - Card 컴포넌트에 isLiked, onLike props 전달 필요.
  // 현재 UI만 구현된 상태로 즐겨찾기 동작하지 않음. 구현 시 즐겨찾기 상태 관리(zustand 등) 및 onLike 핸들러 연결 필요.

  return (
    <div className="w-full flex flex-col items-center gap-4 pt-3 pb-4 bg-yellow-300">
      {sorted.map((c, i) => {
        const room = ROOMS[c.roomIndex];
        const images = room.imageUrls;
        const price = lastQuery
          ? calculateTotalPrice({
              room,
              hourSlots: lastQuery.hour_slots,
              peopleCount: lastQuery.peopleCount,
              dateIso: lastQuery.date,
            })
          : room.pricePerHour;
        const capacity = `${room.recommendCapacity}인`;

        if (c.kind === CardKind.NOT_YET) {
          return (
            <Card
              key={`${c.kind}-${room.bizItemId}-${i}`}
              images={images}
              title={room.branch}
              subtitle={room.name}
              price={price}
              capacity={capacity}
              booked
              reOpenDaysFromNow={c.reOpenDaysFromNow}
            />
          );
        }

        if (c.kind === CardKind.PARTIAL) {
          return (
            <Card
              key={`${c.kind}-${room.bizItemId}-${i}`}
              images={images}
              title={room.branch}
              subtitle={room.name}
              price={price}
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

            case 'oneHourChat':
              return (
                <OneHourChatReservationNoticeModal
                  open
                  onClose={closeModal}
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
