/**
 * 카드 단위 즐겨찾기 훅
 * - deviceId, favoritesQuery, optimisticMutation을 하나로 묶어 Card 컴포넌트를 단순하게 유지
 */
import { useDeviceId } from './useDeviceId';
import { useFavoritesQuery } from '../api/get/useFavoritesQueries';
import { useOptimisticFavorite } from './useOptimisticFavorite';

interface UseCardFavoriteParams {
  bizItemId?: string;
  businessId?: string;
}

export const useCardFavorite = ({ bizItemId, businessId }: UseCardFavoriteParams) => {
  const deviceId = useDeviceId();
  const enabled = Boolean(bizItemId && businessId && deviceId);

  const { data: favoritesData } = useFavoritesQuery({ deviceId: deviceId ?? '' }, { enabled });

  const isLiked = favoritesData?.result?.biz_item_ids?.includes(bizItemId ?? '') ?? false;

  const { mutate: toggleFavorite, isPending: isFavoriteLoading } = useOptimisticFavorite({
    biz_item_id: bizItemId ?? '',
    business_id: businessId ?? '',
    deviceId: deviceId ?? '',
    isLiked,
  });

  const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (enabled) toggleFavorite();
  };

  return { isLiked, isFavoriteLoading, handleLikeClick };
};
