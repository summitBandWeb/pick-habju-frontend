import type { DeleteFavoriteAPIResponse } from './favorites.types';
import kyInstance from '../ky-instance';

export interface DeleteFavoriteRequestDto {
  biz_item_id: string;
  business_id: string;
  deviceId: string;
}

export const deleteFavorite = async ({
  biz_item_id,
  business_id,
  deviceId,
}: DeleteFavoriteRequestDto): Promise<DeleteFavoriteAPIResponse> => {
  return kyInstance
    .delete(`api/favorites/${biz_item_id}`, {
      searchParams: {
        business_id,
      },
      headers: {
        'X-Device-Id': deviceId,
      },
    })
    .json<DeleteFavoriteAPIResponse>();
};
