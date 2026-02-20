import type { BaseResponse } from '../api.types';

export interface GetFavoritesResponseDto {
  biz_item_ids: string[];
}

export type GetFavoritesAPIResponse = BaseResponse<GetFavoritesResponseDto>;
