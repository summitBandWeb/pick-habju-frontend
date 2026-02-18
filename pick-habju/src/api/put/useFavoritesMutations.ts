import { useMutation } from '@tanstack/react-query';
import { putFavorite, type FavoriteRequestDto } from './favoritesApi';

export const useFavoriteMutation = () => {
  return useMutation({
    mutationFn: (payload: FavoriteRequestDto) => putFavorite(payload),
  });
};
