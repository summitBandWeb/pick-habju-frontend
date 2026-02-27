import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { getFavorites, type GetFavoritesRequestDto } from './favoritesApi';
import type { GetFavoritesAPIResponse } from './favorites.types';

export const useFavoritesQuery = <TSelected = GetFavoritesAPIResponse>(
  payload: GetFavoritesRequestDto,
  options?: Omit<
    UseQueryOptions<GetFavoritesAPIResponse, Error, TSelected>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: ['favorites', payload.deviceId],
    queryFn: () => getFavorites(payload),
    ...options,
  });
};
