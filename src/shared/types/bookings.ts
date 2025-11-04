// Estados posibles de una reserva
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

// Tipo principal para las reservas del usuario
export interface UserBooking {
  id: string;
  // numero de personas (legacy en castellano) - preferir usar `peopleCount` cuando sea posible
  cantidadPersonas: number;
  // nuevo nombre en inglés para mayor consistencia con el backend/servicios
  peopleCount?: number;
  fechaReserva: Date;
  idGuia?: string;
  idReserva: string;
  idSlot: string;
  idTour?: string;
  idTurista?: string;
  // precio por persona
  precioUnitario: number;
  // total almacenado (legacy)
  total: number;
  // nuevo nombre para total en registros recientes
  precioTotal?: number;
  estado: BookingStatus;
  fechaCreacion: Date;
  fechaActualizacion?: Date;
}

// Tipo para el array de reservas del usuario
export type UserBookings = UserBooking[];