import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserBookings } from '../types';
import { getUserBookings } from '../../services/getUserBookings';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../app/config/firebase';

// Keys constantes para las queries
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (userId: string) => [...bookingKeys.lists(), userId] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
};

export const useUserBookings = (userId: string) => {
  return useQuery<UserBookings, Error>({
    queryKey: bookingKeys.list(userId),
    queryFn: () => getUserBookings(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1, // 1 minuto de datos frescos
    refetchInterval: 1000 * 30, // Refresca cada 30 segundos
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

// Función para cancelar una reserva con actualización optimista
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  const cancelBooking = async (bookingId: string, userId: string) => {
    // Guardar estado anterior
    const previousData = queryClient.getQueryData(bookingKeys.list(userId));

    // Actualización optimista
    queryClient.setQueryData(bookingKeys.list(userId), (old: UserBookings | undefined) => {
      if (!old) return [];
      return old.map(booking => {
        if (booking.id === bookingId || booking.idReserva === bookingId) {
          return { ...booking, estado: 'cancelled' };
        }
        return booking;
      });
    });

    try {
      // Realizar la actualización en Firestore
      const bookingRef = doc(db, 'reserva', bookingId);
      await updateDoc(bookingRef, {
        estado: 'cancelled'
      });

      // Invalidar y refrescar los datos
      await queryClient.invalidateQueries({ queryKey: bookingKeys.list(userId) });

      return { success: true };
    } catch (error) {
      // Revertir al estado anterior en caso de error
      queryClient.setQueryData(bookingKeys.list(userId), previousData);
      throw error;
    }
  };

  return { cancelBooking };
};