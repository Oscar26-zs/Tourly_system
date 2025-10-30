import { collection, query, where, getDocs, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../../app/config/firebase";

export interface UpcomingBooking {
  id: string;
  tourDate: Date;
  numberOfPeople: number;
  status: string;
}

/**
 * Obtiene las próximas reservas de un tour específico
 * @param tourId - ID del tour
 * @returns Array de reservas próximas
 */
export async function getUpcomingBookingsByTour(tourId: string): Promise<UpcomingBooking[]> {
  try {
    if (!tourId) return [];

    const now = Timestamp.now();
    const bookingsCol = collection(db, "reservas");
    
    // Buscar reservas futuras del tour que estén confirmadas o pendientes
    const q = query(
      bookingsCol,
      where("tourId", "==", tourId),
      where("tourDate", ">=", now),
      where("status", "in", ["confirmed", "pending"]),
      orderBy("tourDate", "asc")
    );

    const snap = await getDocs(q);
    
    const bookings: UpcomingBooking[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        tourDate: data.tourDate?.toDate() || new Date(),
        numberOfPeople: data.numberOfPeople || 1,
        status: data.status || "pending",
      };
    });

    return bookings.slice(0, 3); // Retornar solo las 3 próximas
  } catch (error) {
    console.error("❌ Error obteniendo reservas próximas:", error);
    return [];
  }
}
