import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../app/config/firebase";
import type { Category } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    const colRef = collection(db, "categorias");
    const q = query(colRef, orderBy("nombreCategoria"));
    const snap = await getDocs(q);

    const categories: Category[] = snap.docs.map((d) => {
      const data = d.data() as Partial<Category>;
      return {
        id: d.id,
        nombreCategoria: data.nombreCategoria ?? "",
        descripcion: data.descripcion ?? undefined,
        idCategoria: (data as any).idCategoria ?? undefined,
      };
    });

    return categories;
  } catch (err) {
    console.error("fetchCategories error:", err);
    throw err;
  }
}