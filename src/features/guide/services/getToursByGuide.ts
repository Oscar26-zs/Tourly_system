import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../../../app/config/firebase";
import type { Tour } from "../../public/types/tour";

// ...existing code...

export async function getToursByGuide(guideId: string): Promise<Tour[]> {
  try {
    if (!guideId) return [];
    console.log("🎯 Obteniendo tours para guía (id):", guideId);

    // Crear la referencia al documento del usuario/guía
    const guideRef = doc(db, "usuarios", guideId);

    const toursCol = collection(db, "tours");
    const q = query(toursCol, where("idGuia", "==", guideRef));
    const snap = await getDocs(q);

    const tours: Tour[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Tour, "id">),
    }));

    console.log(`✅ Encontrados ${tours.length} tours para guía ${guideId}`);
    return tours;
  } catch (error) {
    console.error("❌ Error obteniendo tours por guideId:", error);
    return [];
  }
}