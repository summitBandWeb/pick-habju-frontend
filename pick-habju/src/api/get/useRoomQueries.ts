import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getAvailability, type RoomRequestDto } from './roomApi';
import type { BookingAPIResponse } from '../api.types';

export const useRoomAvailabilityQuery = <TSelected = BookingAPIResponse>(
  payload: RoomRequestDto | null,
  options?: Omit<
    UseQueryOptions<BookingAPIResponse, Error, TSelected>,
    'queryKey' | 'queryFn' | 'enabled'
  >
) => {
  return useQuery({
    queryKey: ['room-availability', payload],
    queryFn: () => getAvailability(payload as RoomRequestDto),
    enabled: !!payload,
    ...options,
  });
};
