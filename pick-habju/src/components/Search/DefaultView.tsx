import Card from '../Card/Card';
import { ROOMS } from '../../constants/data';
import { useSearchStore } from '../../store/search/searchStore';

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

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      {sorted.map((c, i) => {
        const room = ROOMS[c.roomIndex];
        const images = room.imageUrls;
        const price = room.pricePerHour;
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
          <Card
            key={`${c.kind}-${room.bizItemId}-${i}`}
            images={images}
            title={room.branch}
            subtitle={room.name}
            price={price}
            locationText={locationText}
            walkTime={walkTime}
            capacity={capacity}
          />
        );
      })}
    </div>
  );
};

export default DefaultView;
