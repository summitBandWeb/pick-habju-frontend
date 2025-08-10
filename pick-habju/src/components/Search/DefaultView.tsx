import Card from '../Card/Card';
import { ROOMS } from '../../constants/data';
import { useSearchStore } from '../../store/search/searchStore';

const DefaultView = () => {
  const cards = useSearchStore((s) => s.cards);

  return (
    <div className="w-full flex flex-col items-center gap-4 py-4">
      {cards.map((c, i) => {
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
