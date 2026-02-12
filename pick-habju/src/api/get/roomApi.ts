import type { BookingAPIResponse } from '../api.types';
import kyInstance from '../ky-instance';

export interface RoomRequestDto {
  date: string;
  capacity: number;
  start_hour: string;
  end_hour: string;
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export const getAvailability = async ({
  date,
  capacity,
  start_hour,
  end_hour,
  swLat,
  swLng,
  neLat,
  neLng,
}: RoomRequestDto): Promise<BookingAPIResponse> => {
  return kyInstance
    .get('api/rooms/availability/', {
      searchParams: {
        date,
        capacity,
        start_hour,
        end_hour,
        swLat,
        swLng,
        neLat,
        neLng,
      },
    })
    .json<BookingAPIResponse>();
};
