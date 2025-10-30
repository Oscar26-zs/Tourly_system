import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { createSlot, type CreateSlotInput } from "../services/createSlot";

/**
 * Hook para crear un slot usando React Query.
 * Invalida la cache de "slots" y "tours" por defecto tras el éxito.
 */
export function useCreateSlot(
  options?: UseMutationOptions<string, Error, CreateSlotInput, unknown>
) {
  const qc = useQueryClient();

  return useMutation<string, Error, CreateSlotInput, unknown>({
    ...options,
    mutationFn: async (input: CreateSlotInput) => {
      return createSlot(input);
    },
    onSuccess: async (data, variables, context) => {
      // invalidar queries relevantes para refrescar UI
      try {
        await Promise.all([
          qc.invalidateQueries({ queryKey: ["slot"] }),
          qc.invalidateQueries({ queryKey: ["tours"] }),
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