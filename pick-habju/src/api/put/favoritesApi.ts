import type { FavoriteAPIResponse } from './favorites.types';
import kyInstance from '../ky-instance';

export interface FavoriteRequestDto {
  biz_item_id: string;
  business_id: string;
  deviceId: string;
}

export const putFavorite = async ({
  biz_item_id,
  business_id,
  deviceId,
}: FavoriteRequestDto): Promise<FavoriteAPIResponse> => {
  return kyInstance
    .put(`api/favorites/${biz_item_id}`, {
      searchParams: {
        business_id,
      },
      headers: {
        'X-Device-Id': deviceId,
      },
    })
    .json<FavoriteAPIResponse>();
};
