import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../app/config/firebase';

interface BookingData {
  idSlot: string;  // Viene como path string: "/slot/1"
  cantidadPersonas: number;
  estado: string;
}

interface SlotData {
  asientosDisponibles: number;
  capacidadMax: number;
  activo: boolean;
}

export const cancelBooking = async (bookingId: string): Promise<void> => {
  try {
    // Obtener los datos de la reserva
    const bookingRef = doc(db, 'reserva', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (!bookingSnap.exists()) {
      throw new Error('Booking not found');
    }

    const bookingData = bookingSnap.data() as BookingData;
    
    // Extraer el ID del slot del path
    const slotId = bookingData.idSlot.split('/')[2];
    if (!slotId) {
      throw new Error('Invalid slot path');
    }
    
    // Crear una referencia correcta al slot
    const slotRef = doc(db, 'slot', slotId);
    const cantidadPersonas = Number(bookingData.cantidadPersonas || 0);

    const slotSnap = await getDoc(slotRef);

    if (!slotSnap.exists()) {
      throw new Error('Slot not found');
    }

    // Actualizar ambos documentos en una transacción
    await runTransaction(db, async (transaction) => {
      // Verificar los datos actuales dentro de la transacción
      const currentSlotDoc = await transaction.get(slotRef);
      if (!currentSlotDoc.exists()) {
        throw new Error('Slot not found during transaction');
      }

      const currentSlotData = currentSlotDoc.data() as SlotData;
      const currentAsientos = Number(currentSlotData.asientosDisponibles);
      const newAsientos = currentAsientos + cantidadPersonas;

      console.log('Debug - Estado de la transacción:', {
        slotId,
        currentAsientos,
        cantidadPersonas,
        newAsientos,
        capacidadMax: currentSlotData.capacidadMax
      });

      if (newAsientos > currentSlotData.capacidadMax) {
        console.error('Error: La suma excedería la capacidad máxima del slot');
        throw new Error('La suma excedería la capacidad máxima del slot');
      }

      // Actualizar la reserva a cancelled
      transaction.update(bookingRef, {
        estado: 'cancelled'
      });

      // Actualizar los asientos disponibles del slot
      transaction.update(slotRef, {
        asientosDisponibles: newAsientos
      });
    });

    return Promise.resolve();
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return Promise.reject(error);
  }
};