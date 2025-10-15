// services/getUserBookings.ts
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  DocumentReference,
} from 'firebase/firestore';
import type { UserBookings, UserBooking } from '../shared/types';
import { db } from '../app/config/firebase';

function toDateSafe(v: any): Date {
  if (!v) return new Date();
  if (typeof v?.toDate === 'function') return v.toDate(); // Firestore Timestamp
  if (v instanceof Date) return v;
  if (typeof v === 'string') return new Date(v);
  return new Date();
}

function isDocRef(v: any): v is DocumentReference {
  return v && typeof v === 'object' && typeof v.id === 'string' && typeof v.path === 'string';
}

function idFromRefOrPath(v: any): string {
  if (isDocRef(v)) return v.id;
  if (typeof v === 'string') {
    const parts = v.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : v;
  }
  return '';
}

async function fetchBy(refOrValue: string | DocumentReference) {
  const reservasRef = collection(db, 'reserva');
  const q = query(reservasRef, where('idTurista', '==', refOrValue));
  return getDocs(q);
}

export const getUserBookings = async (userId: string): Promise<UserBookings> => {
  if (!userId) throw new Error('User ID is required');

  // 1) intento con DocumentReference
  const turistaRef = doc(db, 'usuarios', userId);
  let snap = await fetchBy(turistaRef);

  // 2) si no hay resultados, intento con string "/usuarios/<uid>"
  if (snap.empty) snap = await fetchBy(`/usuarios/${userId}`);

  // 3) último intento con el uid “pelado”
  if (snap.empty) snap = await fetchBy(userId);

  const bookings: UserBooking[] = snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      idReserva: data.idReserva || d.id,
      cantidadPersonas: Number(data.cantidadPersonas ?? 0),
      fechaReserva: toDateSafe(data.fechaReserva),
      fechaCreacion: toDateSafe(data.fechaCreacion),
      fechaActualizacion: data.fechaActualizacion ? toDateSafe(data.fechaActualizacion) : undefined,
      idGuia: idFromRefOrPath(data.idGuia),
      idSlot: idFromRefOrPath(data.idSlot),
      idTour: idFromRefOrPath(data.idTour),
      idTurista: idFromRefOrPath(data.idTurista),
      precioUnitario: Number(data.precioUnitario ?? 0),
      total: Number(data.total ?? 0),
      estado: (data.estado as UserBooking['estado']) ?? 'pending',
    };
  });

  // Ordenar por fecha de reserva (desc)
  return bookings.sort((a, b) => b.fechaReserva.getTime() - a.fechaReserva.getTime());
};
