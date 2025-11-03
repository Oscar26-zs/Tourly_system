import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../../../app/config/firebase";
import type { Slot } from "../../public/types/slot";

export async function fetchSlotsByGuide(guideId: string): Promise<Slot[]> {
  // si guardaste idGuia como DocumentReference:
  const guideRef = doc(db, "usuarios", guideId);
  const q = query(collection(db, "slot"), where("idGuia", "==", guideRef));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as Slot));
}

export function useSlotsByGuide(guideId?: string) {
  return useQuery<Slot[]>({
    queryKey: ["slotsByGuide", guideId],
    queryFn: async () => {
      if (!guideId) return [] as Slot[];
      return await fetchSlotsByGuide(guideId);
    },
    enabled: !!guideId,
    refetchInterval: 5000, // opcional: refetch cada 5s para "tiempo real" ligero
    staleTime: 1000 * 5,
  });
}