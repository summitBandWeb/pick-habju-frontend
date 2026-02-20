import { useQuery } from '@tanstack/react-query';
import { getFavorites, type GetFavoritesRequestDto } from './favoritesApi';

export const useFavoritesQuery = (payload: GetFavoritesRequestDto) => {
  return useQuery({
    queryKey: ['favorites', payload.deviceId],
    queryFn: () => getFavorites(payload),
  });
};
