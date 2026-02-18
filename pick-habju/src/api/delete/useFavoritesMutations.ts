import { useMutation } from '@tanstack/react-query';
import { deleteFavorite, type DeleteFavoriteRequestDto } from './favoritesApi';

export const useDeleteFavoriteMutation = () => {
  return useMutation({
    mutationFn: (payload: DeleteFavoriteRequestDto) => deleteFavorite(payload),
  });
};
