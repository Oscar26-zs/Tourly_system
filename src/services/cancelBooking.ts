import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../app/config/firebase';

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    const bookingRef = doc(db, 'reserva', bookingId);
    
    await updateDoc(bookingRef, {
      estado: 'cancelled'
    });

    return Promise.resolve();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return Promise.reject(error);
  }
};