import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { createSlot, type CreateSlotInput } from "../services/createSlot";

export function useCreateSlot(
  options?: UseMutationOptions<string, Error, CreateSlotInput & { guideId?: string }, unknown>
) {
  const qc = useQueryClient();
  return useMutation<string, Error, CreateSlotInput & { guideId?: string }, unknown>({
    ...options,
    mutationFn: async (input: CreateSlotInput & { guideId?: string }) => {
      return createSlot(input);
    },
    onSuccess: async (data, variables, context) => {
      // invalidar queries relevantes para refrescar UI
      try {
        await Promise.all([
          qc.invalidateQueries({ queryKey: ["slot"] }),
          qc.invalidateQueries({ queryKey: ["tours"] }),
          // si se pasó guideId invalidar la cache por guia
          variables?.guideId ? qc.invalidateQueries({ queryKey: ["slotsByGuide", variables.guideId] }) : Promise.resolve(),
        ]);
      } catch (e) {
        // no bloquear la ejecución si falla la invalidación
        console.warn("useCreateSlot: invalidate queries failed", e);
      }

      // ejecutar onSuccess pasado en options si existe
      if (options && typeof options.onSuccess === "function") {
        (options.onSuccess as any)(data, variables, context);
      }
    },
  });
}