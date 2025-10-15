import { useEffect, useState, useCallback } from 'react';
import { db } from '../../../app/config/firebase';
import {
  doc,
  getDoc,
  runTransaction,
  collection,
  Timestamp,
} from 'firebase/firestore';
import type { Slot } from '../types/slot';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  slotId: string;
  tourId: string;
  fullName: string;
  email: string;
  phone?: string;
  peopleCount: number;
  notes?: string;
  createdAt: string; // ISO
  status: BookingStatus;
}

type UseBookingFormReturn = {
  slot: Slot | null;
  availableSeats: number;
  isLoading: boolean;
  isSubmitting: boolean;
  error: Error | null;
  onSubmit: (payload: {
    fullName: string;
    email: string;
    phone?: string;
    peopleCount: number;
    notes?: string;
    userId?: string; // optional tourist id to link reservation
  }) => Promise<{ reservationId: string }>; 
  refresh: () => Promise<void>;
};

export function useBookingForm(slotId: string | null): UseBookingFormReturn {
  const [slot, setSlot] = useState<Slot | null>(null);
  const [availableSeats, setAvailableSeats] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSlot = useCallback(async () => {
    if (!slotId) return;
    setIsLoading(true);
    setError(null);
    try {
      const slotRef = doc(db, 'slot', slotId);
      const snap = await getDoc(slotRef);
      if (!snap.exists()) {
        throw new Error('Slot no encontrado');
      }
      const data = snap.data() as any;
      const slotData: Slot = {
        id: snap.id,
        idTour: data.idTour,
        activo: data.activo === true,
        asientosDisponibles: typeof data.asientosDisponibles === 'number' ? data.asientosDisponibles : (data.asientos || 0),
        capacidadMax: data.capacidadMax || data.capacidad || 0,
        fechaHoraFin: data.fechaHoraFin || data.fechaFin || '',
        fechaHoraInicio: data.fechaHoraInicio || data.fechaInicio || '',
        idSlot: data.idSlot,
      };

      setSlot(slotData);
      setAvailableSeats(slotData.asientosDisponibles || 0);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [slotId]);

  useEffect(() => {
    void fetchSlot();
  }, [fetchSlot]);

  const onSubmit = useCallback(async (payload: {
    fullName: string;
    email: string;
    phone?: string;
    peopleCount: number;
    notes?: string;
    userId?: string;
  }) => {
    if (!slotId) throw new Error('slotId is required');
    setIsSubmitting(true);
    setError(null);

    try {
      const slotRef = doc(db, 'slot', slotId);

      const reservationId = await runTransaction(db, async (tx) => {
        const slotSnap = await tx.get(slotRef);
        if (!slotSnap.exists()) throw new Error('Slot no encontrado');
        const slotData = slotSnap.data() as any;

        const currentAvailable = typeof slotData.asientosDisponibles === 'number' ? slotData.asientosDisponibles : (slotData.asientos || 0);
        const activo = slotData.activo === true;

        if (!activo) {
          throw new Error('Este slot no está activo');
        }

        if (currentAvailable < payload.peopleCount) {
          throw new Error('No hay suficientes asientos disponibles');
        }

        // Resolver tourId desde idTour que puede ser DocumentReference o string
        let tourId = '';
        const idTourField = slotData.idTour;
        if (idTourField && typeof idTourField === 'object' && 'id' in idTourField) {
          tourId = (idTourField as any).id;
        } else if (typeof idTourField === 'string') {
          tourId = idTourField.replace('/tours/', '').replace('tours/', '');
        }

        // Crear reserva en la colección 'reserva' (consistente con el resto del proyecto)
        const reservasRef = collection(db, 'reserva');
        const newReservaRef = doc(reservasRef);

        const now = new Date();

        const reservaDoc: any = {
          idReserva: newReservaRef.id,
          idSlot: slotId,
          idTour: tourId,
          nombreCompleto: payload.fullName,
          email: payload.email,
          telefono: payload.phone || '',
          cantidadPersonas: payload.peopleCount,
          notas: payload.notes || '',
          estado: 'pending',
          fechaCreacion: Timestamp.fromDate(now),
          fechaReserva: Timestamp.fromDate(now),
        };

        // También añadimos las keys en inglés para el nuevo modelo si se prefiere
        reservaDoc.fullName = payload.fullName;
        reservaDoc.peopleCount = payload.peopleCount;
        reservaDoc.status = 'confirmed';
        reservaDoc.createdAt = now.toISOString();

        tx.set(newReservaRef, reservaDoc);

        // Actualizar asientos disponibles
        tx.update(slotRef, { asientosDisponibles: currentAvailable - payload.peopleCount });

        return newReservaRef.id;
      });

      // Actualizar estado local
      await fetchSlot();
      return { reservationId };
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [slotId, fetchSlot]);

  const refresh = useCallback(async () => {
    await fetchSlot();
  }, [fetchSlot]);

  return {
    slot,
    availableSeats,
    isLoading,
    isSubmitting,
    error,
    onSubmit,
    refresh,
  };
}

export default useBookingForm;
