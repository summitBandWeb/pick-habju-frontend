import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putFavorite, type FavoriteRequestDto } from '../api/put/favoritesApi';
import { deleteFavorite, type DeleteFavoriteRequestDto } from '../api/delete/favoritesApi';
import type { GetFavoritesAPIResponse } from '../api/get/favorites.types';
import type { FavoriteAPIResponse } from '../api/put/favorites.types';
import type { DeleteFavoriteAPIResponse } from '../api/delete/favorites.types';

interface UseOptimisticFavoriteParams {
  biz_item_id: string;
  business_id: string;
  deviceId: string;
  isLiked: boolean; // 현재 즐겨찾기 상태
}

/**
 * Optimistic Update를 적용한 즐겨찾기 토글 훅
 * 
 * @description
 * - 사용자가 즐겨찾기 버튼을 클릭하면 즉시 UI에 반영 (Optimistic Update)
 * - 서버 요청 실패 시 이전 상태로 롤백
 * - isLiked 상태에 따라 PUT(추가) 또는 DELETE(제거) API를 자동 선택
 * 
 * @example
 * // useCardFavorite 훅을 통해 사용 (권장)
 * const { isLiked, handleLikeClick } = useCardFavorite({ bizItemId, businessId });
 *
 * // 직접 사용이 필요한 경우
 * const { mutate: toggleFavorite } = useOptimisticFavorite({
 *   biz_item_id: bizItemId,
 *   business_id: businessId,
 *   deviceId,
 *   isLiked,
 * });
 */

export function useOptimisticFavorite({
  biz_item_id,
  business_id,
  deviceId,
  isLiked,
}: UseOptimisticFavoriteParams) {
  const queryClient = useQueryClient();
  const queryKey = ['favorites', deviceId];

  return useMutation<FavoriteAPIResponse | DeleteFavoriteAPIResponse, Error, void, { previousFavorites?: GetFavoritesAPIResponse }>({
    // isLiked 상태에 따라 추가/삭제 API 선택
    mutationFn: async () => {
      const payload = { biz_item_id, business_id, deviceId };
      return isLiked 
        ? deleteFavorite(payload as DeleteFavoriteRequestDto)
        : putFavorite(payload as FavoriteRequestDto);
    },

    // onMutate: API 요청 직전에 실행 → Optimistic Update로 UI를 먼저 변경
    onMutate: async () => {
      // 1. 진행 중인 쿼리 취소 (경쟁 상태 방지)
      await queryClient.cancelQueries({ queryKey });

      // 2. 현재 캐시된 즐겨찾기 목록 가져오기 (롤백용)
      const previousFavorites = queryClient.getQueryData<GetFavoritesAPIResponse>(queryKey);

      if (!previousFavorites) {
        // 캐시가 없으면 롤백 정보만 반환
        return { previousFavorites: undefined };
      }

      // 3. Deep copy로 새로운 즐겨찾기 목록 생성 (원본 보존)
      const newFavorites: GetFavoritesAPIResponse = {
        ...previousFavorites,
        result: {
          ...previousFavorites.result,
          biz_item_ids: [...previousFavorites.result.biz_item_ids],
        },
      };

      // 4. 즐겨찾기 추가/제거 로직
      const currentIds = newFavorites.result.biz_item_ids;
      const index = currentIds.findIndex((id: string) => id === biz_item_id);

      if (isLiked) {
        // 이미 좋아요 상태 → 제거
        if (index >= 0) {
          currentIds.splice(index, 1);
        }
      } else {
        // 좋아요하지 않은 상태 → 추가
        if (index === -1) {
          currentIds.push(biz_item_id);
        }
      }

      // 5. 업데이트된 데이터를 캐시에 즉시 반영 → UI가 바로 변경됨
      queryClient.setQueryData(queryKey, newFavorites);

      // 6. 롤백용 데이터 반환
      return { previousFavorites };
    },

    // onError: 요청 실패 시 이전 상태로 롤백
    onError: (error, _variables, context) => {
      console.error('즐겨찾기 업데이트 실패:', error);
      
      // 이전 상태로 되돌리기
      if (context?.previousFavorites !== undefined) {
        queryClient.setQueryData(queryKey, context.previousFavorites);
      }
    },

    // onSettled: 성공/실패 여부와 관계없이 최종적으로 서버 데이터와 동기화
    onSettled: async () => {
      // 서버에서 최신 즐겨찾기 목록을 다시 가져와서 캐시 갱신
      await queryClient.invalidateQueries({
        queryKey,
        exact: true, // 정확히 일치하는 쿼리만 무효화
      });
    },
  });
}
