import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../app/config/firebase";
import type { Tour } from "../types/tour";

export async function getTourById(tourId: string): Promise<Tour | null> {
  try {
    console.log("🎯 Obteniendo tour por ID:", tourId);
    
    const tourRef = doc(db, "tours", tourId);
    const tourSnap = await getDoc(tourRef);
    
    if (tourSnap.exists()) {
      const tourData = {
        id: tourSnap.id,
        ...tourSnap.data()
      } as Tour;
      
      console.log("✅ Tour encontrado:", tourData);
      return tourData;
    } else {
      console.log("❌ Tour no encontrado");
      return null;
    }
  } catch (error) {
    console.error("❌ Error obteniendo tour:", error);
    return null;
  }
}