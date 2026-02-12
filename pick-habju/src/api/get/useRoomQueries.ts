import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { getAvailability, type RoomRequestDto } from './roomApi';

export const useRoomAvailabilityQuery = () => {
  const queryClient = useQueryClient();
  const isLoading = useIsFetching({ queryKey: ['room-availability'] }) > 0;

  const fetchAvailability = (payload: RoomRequestDto) =>
    queryClient.fetchQuery({
      queryKey: ['room-availability', payload],
      queryFn: () => getAvailability(payload),
    });

  return { fetchAvailability, isLoading };
};
