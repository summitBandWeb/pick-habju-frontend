import Card from '../Card/Card';
import { ROOMS } from '../../constants/data';
import { useSearchStore } from '../../store/search/searchStore';
import { calculateTotalPrice } from '../../utils/calcTotalPrice';
import { useState } from 'react';
import BookModalStepper from '../Modal/Book/BookModal';
import ModalOverlay from '../Modal/ModalOverlay.tsx';

const DefaultView = () => {
  const cards = useSearchStore((s) => s.cards);
  const sorted = [...cards]
    .map((c, idx) => ({ c, idx }))
    .sort((a, b) => {
      const rank = (kind: typeof a.c.kind) => (kind === 'default' ? 0 : kind === 'recommend' ? 1 : 2);
      const ra = rank(a.c.kind);
      const rb = rank(b.c.kind);
      if (ra !== rb) return ra - rb;
      return a.idx - b.idx; // 안정성 보장
    })
    .map((x) => x.c);

  const lastQuery = useSearchStore((s) => s.lastQuery);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
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
              onBookClick={() => setOpenIdx(i)}
            />
            {openIdx === i && lastQuery && (
              <ModalOverlay open onClose={() => setOpenIdx(null)}>
                <div className="w-[25.125rem] transform translate-x-6.5" onClick={(e) => e.stopPropagation()}>
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
    </div>
  );
};

export default DefaultView;
