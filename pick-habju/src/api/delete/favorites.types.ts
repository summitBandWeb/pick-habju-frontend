import type { BaseResponse } from '../api.types';

export interface DeleteFavoriteResponseDto {
  deleted: boolean;
}

export type DeleteFavoriteAPIResponse = BaseResponse<DeleteFavoriteResponseDto>;
