import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../app/config/firebase";

/**
 * Activa o desactiva un tour
 * @param tourId - ID del tour a actualizar
 * @param newStatus - Nuevo estado (true = activo, false = inactivo)
 */
export async function toggleTourStatus(tourId: string, newStatus: boolean): Promise<void> {
  try {
    const tourRef = doc(db, "tours", tourId);
    await updateDoc(tourRef, {
      Activo: newStatus,
    });
    console.log(`✅ Tour ${tourId} actualizado a estado: ${newStatus ? 'Activo' : 'Inactivo'}`);
  } catch (error) {
    console.error("❌ Error actualizando estado del tour:", error);
    throw new Error("No se pudo actualizar el estado del tour");
  }
}
