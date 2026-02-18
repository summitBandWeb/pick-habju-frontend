import { useQuery } from '@tanstack/react-query';
import { getPing } from './pingApi';

export const usePingQuery = () => {
  return useQuery({
    queryKey: ['ping'],
    queryFn: getPing,
    staleTime: Infinity, // 한 번 호출 후 재호출 방지
    gcTime: Infinity, // 캐시 무제한 유지
    retry: false, // 실패해도 재시도 안 함 (coldstart 방지용)
  });
};
