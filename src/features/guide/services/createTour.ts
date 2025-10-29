import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  type DocumentData,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "../../../app/config/firebase";
import type { Tour } from "../../public/types/tour";

/**
 * Input para crear un tour. Usar las claves en español (como en tu BBDD).
 * Campos opcionales se rellenan con valores por defecto cuando procede.
 */
export type CreateTourInput = Partial<
  Pick<
    Tour,
    | "titulo"
    | "descripcion"
    | "precio"
    | "ciudad"
    | "duracion"
    | "imagenes"
    | "fotos"
    | "idCategoria"
    | "idGuia"
    | "incluye"
    | "noIncluye"
    | "puntoEncuentro"
    | "Activo"
    | "itinerary"
    | "highlights"
    | "ratingPromedio"
    | "cantidadReseñas"
  >
> & {
  idGuia?: string | DocumentReference;
  idCategoria?: string | DocumentReference;
  id?: string;
};


export async function createTour(input: CreateTourInput): Promise<string> {
  try {
    const toursCol = collection(db, "tours");

    // Normalize payload
    const payload: DocumentData = {
      titulo: input.titulo ?? "",
      descripcion: input.descripcion ?? "",
      precio: input.precio ?? 0,
      ciudad: input.ciudad ?? "",
      duracion: input.duracion ?? 0,
      imagenes: Array.isArray(input.imagenes) ? input.imagenes : input.imagenes ? [input.imagenes] : [],
      fotos: Array.isArray(input.fotos) ? input.fotos : input.fotos ? [input.fotos] : [],
      incluye: Array.isArray(input.incluye) ? input.incluye : input.incluye ? [input.incluye] : [],
      noIncluye: Array.isArray(input.noIncluye) ? input.noIncluye : input.noIncluye ? [input.noIncluye] : [],
  puntoEncuentro: input.puntoEncuentro ?? "",
  Activo: typeof input.Activo === "boolean" ? input.Activo : true,
      // Ensure itinerary is stored as a plain array of objects even if caller passed an object-like map
      // (sometimes form libraries or serialization may produce {0: {...}, 1: {...}})
      ...(Array.isArray(input.itinerary)
        ? { itinerary: input.itinerary.map((it) => ({
            step: String((it as any).step ?? ""),
            title: String((it as any).title ?? ""),
            duration: String((it as any).duration ?? ""),
            description: String((it as any).description ?? ""),
          })) }
        : input.itinerary
        ? { itinerary: Object.values(input.itinerary as any).map((it: any) => ({
            step: String(it?.step ?? ""),
            title: String(it?.title ?? ""),
            duration: String(it?.duration ?? ""),
            description: String(it?.description ?? ""),
          })) }
        : { itinerary: [] }),
      highlights: input.highlights ?? [],
      ratingPromedio: input.ratingPromedio ?? 0,
      cantidadReseñas: input.cantidadReseñas ?? 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Handle idGuia -> store as DocumentReference if string provided
    if (input.idGuia) {
      if (typeof input.idGuia === "string") {
        payload.idGuia = doc(db, "usuarios", input.idGuia);
      } else {
        payload.idGuia = input.idGuia as DocumentReference;
      }
    }

    // Handle idCategoria -> store as DocumentReference if string provided
    if ((input as any).idCategoria || (input as any).idCategoria === "") {
      const cat = (input as any).idCategoria as string | DocumentReference | undefined;
      if (cat) {
        payload.idCategoria = typeof cat === "string" ? doc(db, "categorias", cat) : (cat as DocumentReference);
      }
    }

    // Use setDoc when caller provided an explicit id
    if (input.id) {
      const customRef = doc(db, "tours", input.id);
      await setDoc(customRef, payload);
      return customRef.id;
    }

    const created = await addDoc(toursCol, payload);
    return created.id;
  } catch (err) {
    console.error("createTour error:", err);
    throw err;
  }
}