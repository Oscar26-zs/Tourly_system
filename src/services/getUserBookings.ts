import { 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import type { UserBookings } from '../shared/types';
import { db } from '../app/config/firebase';

export const getUserBookings = async (userId: string): Promise<UserBookings> => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const reservasRef = collection(db, 'reserva');
    const q = query(
      reservasRef,
      where('idTurista', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    
    const bookings: UserBookings = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        cantidadPersonas: data.cantidadPersonas || 0,
        fechaReserva: data.fechaReserva?.toDate() || new Date(),
        idGuia: data.idGuia || '',
        idReserva: data.idReserva || doc.id,
        idSlot: data.idSlot || '',
        idTour: data.idTour || '',
        idTurista: data.idTurista || '',
        precioUnitario: data.precioUnitario || 0,
        total: data.total || 0,
        estado: data.estado || 'pending',
        fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
        fechaActualizacion: data.fechaActualizacion?.toDate()
      };
    });

    // Ordenamos en JavaScript en lugar de en Firestore para evitar el problema del índice
    return bookings.sort((a, b) => b.fechaReserva.getTime() - a.fechaReserva.getTime());
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error(`Failed to fetch bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};