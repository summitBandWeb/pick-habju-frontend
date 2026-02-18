import type { BaseResponse } from '../api.types';

export interface FavoriteResponseDto {
  added: boolean;
}

export type FavoriteAPIResponse = BaseResponse<FavoriteResponseDto>;
