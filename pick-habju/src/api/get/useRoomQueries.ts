import { useQuery } from '@tanstack/react-query';
import { getAvailability, type RoomRequestDto } from './roomApi';

export const useRoomAvailabilityQuery = (payload: RoomRequestDto | null) => {
  return useQuery({
    queryKey: ['room-availability', payload],
    queryFn: () => getAvailability(payload as RoomRequestDto),
    enabled: !!payload,
  });
};
