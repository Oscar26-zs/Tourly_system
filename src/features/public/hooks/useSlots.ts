import { useQuery } from '@tanstack/react-query';
import { fetchActiveSlots } from '../services/fetchSlots';

export function useSlots() {
  return useQuery({
    queryKey: ['slots'],
    queryFn: fetchActiveSlots,
    staleTime: 1000 * 30, // 30s
    refetchOnWindowFocus: false,
  });
}
