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
import { useAuth } from '../../../app/providers/useAuth';

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
  precioUnitario?: number;
  precioTotal?: number;
  idTurista?: string;
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
  const { user } = useAuth();

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

  // Resolve logged user values (if available) and prefer them when present
  const resolvedEmail = (user && user.email) ? user.email : payload.email;
  const resolvedUserId = (user && user.uid) ? user.uid : (payload.userId ?? undefined);
  const resolvedFullName = (user && (user.displayName || user.email)) ? (user.displayName ?? user.email ?? payload.fullName) : payload.fullName;

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

        // Try to read tour price if available
        let precioUnitario = 0;
        try {
          if (tourId) {
            const tourRef = doc(db, 'tours', tourId);
            const tourSnap = await tx.get(tourRef);
            if (tourSnap.exists()) {
              const tourData: any = tourSnap.data();
              precioUnitario = Number(tourData.precio ?? tourData.price ?? 0) || 0;
            }
          }
        } catch (e) {
          // ignore and keep precioUnitario = 0
        }

        const precioTotal = precioUnitario * payload.peopleCount;

        const reservaDoc: any = {
          idReserva: newReservaRef.id,
          idSlot: slotId,
          idTour: tourId,
          // Use a single canonical name field
          fullName: resolvedFullName,
          email: resolvedEmail || '',
          telefono: payload.phone || '',
          peopleCount: payload.peopleCount,
          notas: payload.notes || '',
          estado: 'pending',
          status: 'pending',
          fechaCreacion: Timestamp.fromDate(now),
          fechaReserva: Timestamp.fromDate(now),
          createdAt: now.toISOString(),
          // pricing
          precioUnitario,
          precioTotal,
          // tourist id (user id)
          idTurista: resolvedUserId ?? null,
        };

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
