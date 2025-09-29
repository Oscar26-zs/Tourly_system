import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { Slot } from "../types/slot";

export async function getSlotsByTourId(tourId: string): Promise<Slot[]> {
  try {
    
    // Obtener todos los slots para manejar DocumentReference
    const allSlotsQuery = query(collection(db, "slot"));
    const allSnapshot = await getDocs(allSlotsQuery);
    
    const matchingSlots = allSnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...(data as Omit<Slot, "id">),
        };
      })
      .filter(slot => {
        // Manejar DocumentReference
        let tourRef = slot.idTour;
        let tourIdFromRef = "";
        
        if (tourRef && typeof tourRef === 'object' && 'id' in tourRef) {
          // Es DocumentReference, extraer el ID
          tourIdFromRef = (tourRef as any).id;
        } else if (typeof tourRef === 'string') {
          // Es string, usar directamente
          tourIdFromRef = tourRef.replace('/tours/', '').replace('tours/', '');
        
        }
        
        const matches = tourIdFromRef === tourId;
        const isActive = slot.activo === true;
        
        return matches && isActive;
      });
    
    return matchingSlots;
    
  } catch (error) {
    console.error("❌ Error obteniendo slots:", error);
    return [];
  }
}