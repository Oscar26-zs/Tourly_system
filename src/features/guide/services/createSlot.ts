import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../app/config/firebase";
import type { DocumentReference } from "firebase/firestore";

export type CreateSlotInput = {
  idTour: string | DocumentReference;
  guideId?: string | DocumentReference; // nuevo
  guideName?: string; // nombre legible del guía para mostrar sin fetch adicional
  activo?: boolean;
  asientosDisponibles: number;
  capacidadMax: number;
  fechaHoraInicio: string | Date;
  fechaHoraFin: string | Date;
  idSlot?: string;
};

/**
 * Crea un documento en la colección "slots" y devuelve el id creado.
 */
export async function createSlot(input: CreateSlotInput): Promise<string> {
  try {
    // Normalizar idTour a DocumentReference si viene como string
    const idTourRef: DocumentReference =
      typeof input.idTour === "string"
        ? doc(db, "tours", input.idTour)
        : input.idTour;

         const guideRef = input.guideId
      ? (typeof input.guideId === "string" ? doc(db, "usuarios", input.guideId) : input.guideId as DocumentReference)
      : undefined;

    // Normalizar fechas a ISO strings (firestore también puede almacenar Timestamp si prefieres)
    const startIso =
      input.fechaHoraInicio instanceof Date
        ? input.fechaHoraInicio.toISOString()
        : new Date(input.fechaHoraInicio).toISOString();

    const endIso =
      input.fechaHoraFin instanceof Date
        ? input.fechaHoraFin.toISOString()
        : new Date(input.fechaHoraFin).toISOString();

    const payload: any = {
      idTour: idTourRef,
      activo: typeof input.activo === "boolean" ? input.activo : true,
      asientosDisponibles: input.asientosDisponibles,
      capacidadMax: input.capacidadMax,
      fechaHoraInicio: startIso,
      fechaHoraFin: endIso,
      createdAt: serverTimestamp(),
    };

    // only include optional fields if defined (Firestore rejects undefined values)
    if (typeof input.idSlot !== "undefined") payload.idSlot = input.idSlot;
    if (guideRef) payload.idGuia = guideRef;
  // guardar nombre legible del guía si llega (evita fetch adicional al mostrar)
  if (typeof input.guideName === "string") payload.guiaName = input.guideName;

    const colRef = collection(db, "slot");
    const res = await addDoc(colRef, payload);
    console.debug("createSlot - created slot id:", res.id, payload);
    return res.id;
  } catch (err) {
    console.error("createSlot error:", err);
    throw err;
  }
}