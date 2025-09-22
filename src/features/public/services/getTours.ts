import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../config/firebase";
import type { Tour } from "../types/tour";

export async function getTours(): Promise<Tour[]> {
  try {
    console.log("🔍 Obteniendo todos los tours...");
    
    // Obtener TODOS los tours sin filtros
    const allToursQuery = query(collection(db, "tours"));
    const snapshot = await getDocs(allToursQuery);
    
    console.log("📊 Total de documentos encontrados:", snapshot.size);
    
    // Convertir a objetos Tour y filtrar manualmente
    const allTours = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...(data as Omit<Tour, "id">),
      };
    });

    // Filtrar tours activos manualmente
    const activeTours = allTours.filter(tour => {
      console.log(`🔍 Verificando tour ${tour.id}: activo = ${tour.Activo} (${typeof tour.Activo})`);
      return tour.Activo === true;
    });

    console.log("✅ Tours activos filtrados:", activeTours.length);
    console.log("🎉 Tours procesados:", activeTours);

    // Ordenar por rating de mayor a menor
    return activeTours.sort((a, b) => b.ratingPromedio - a.ratingPromedio);
    
  } catch (error) {
    console.error("❌ Error en getTours:", error);
    throw error;
  }
}