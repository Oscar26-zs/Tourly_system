import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { Slot } from "../types/slot";

export async function getSlotsByTourId(tourId: string): Promise<Slot[]> {
  try {
    console.log("🎯 Obteniendo slots para tour:", tourId);
    
    // Obtener todos los slots para manejar DocumentReference
    const allSlotsQuery = query(collection(db, "slot"));
    const allSnapshot = await getDocs(allSlotsQuery);
    
    console.log("📊 Total slots en la colección:", allSnapshot.size);
    
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
          console.log(`🔍 Slot ${slot.id}: DocumentReference ID = "${tourIdFromRef}"`);
        } else if (typeof tourRef === 'string') {
          // Es string, usar directamente
          tourIdFromRef = tourRef.replace('/tours/', '').replace('tours/', '');
          console.log(`🔍 Slot ${slot.id}: String = "${tourIdFromRef}"`);
        }
        
        const matches = tourIdFromRef === tourId;
        const isActive = slot.activo === true;
        
        console.log(`✅ Slot ${slot.id}: tourRef="${tourIdFromRef}" vs tourId="${tourId}" = ${matches}, activo=${isActive}`);
        
        return matches && isActive;
      });

    console.log(`🎉 Slots encontrados para tour ${tourId}:`, matchingSlots.length);
    console.log(`📋 Slots coincidentes:`, matchingSlots);
    
    return matchingSlots;
    
  } catch (error) {
    console.error("❌ Error obteniendo slots:", error);
    return [];
  }
}