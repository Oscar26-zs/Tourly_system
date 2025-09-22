import { useQuery } from '@tanstack/react-query';
import { getTours } from '../services/getTours';

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: getTours,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}