// Estados posibles de una reserva
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Tipo principal para las reservas del usuario
export interface UserBooking {
  id: string;
  cantidadPersonas: number;
  fechaReserva: Date;
  idGuia: string;
  idReserva: string;
  idSlot: string;
  idTour: string;
  idTurista: string;
  precioUnitario: number;
  total: number;
  estado: BookingStatus;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
}

// Tipo para el array de reservas del usuario
export type UserBookings = UserBooking[];