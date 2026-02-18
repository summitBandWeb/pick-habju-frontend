import type { GetFavoritesAPIResponse } from './favorites.types';
import kyInstance from '../ky-instance';

export interface GetFavoritesRequestDto {
  deviceId: string;
}

export const getFavorites = async ({ deviceId }: GetFavoritesRequestDto): Promise<GetFavoritesAPIResponse> => {
  return kyInstance
    .get('api/favorites', {
      headers: {
        'X-Device-Id': deviceId,
      },
    })
    .json<GetFavoritesAPIResponse>();
};
