import { useQuery } from '@tanstack/react-query';
import type { UserBookings } from '../types';
import { getUserBookings } from '../../services/getUserBookings';

export const useUserBookings = (userId: string) => {
  return useQuery<UserBookings, Error>({
    queryKey: ['userBookings', userId],
    queryFn: () => getUserBookings(userId),
    enabled: !!userId, // Solo ejecuta si hay userId
    staleTime: 5 * 60 * 1000, // 5 minutos de datos frescos
    retry: 2, // Reintentos en caso de error
    refetchOnWindowFocus: false, // No refetch al enfocar ventana
  });
};