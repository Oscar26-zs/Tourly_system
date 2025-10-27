
import { getToursByGuide } from '../services/getToursByGuide';
import type { Tour } from '../../public/types/tour';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useGuideTours(
  guideId?: string | null,
  options?: UseQueryOptions<Tour[], Error>
) {
  return useQuery<Tour[], Error>({
    queryKey: ['guideTours', guideId],
    queryFn: async () => {
      if (!guideId) return [];
      return await getToursByGuide(String(guideId));
    },
    enabled: !!guideId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    retry: 1,
    ...options,
  });
}