import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTourStatus } from "../services/toggleTourStatus";

export function useToggleTourStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tourId, newStatus }: { tourId: string; newStatus: boolean }) =>
      toggleTourStatus(tourId, newStatus),
    onSuccess: () => {
      // Invalidar la cache de tours para que se recarguen
      queryClient.invalidateQueries({ queryKey: ["guideTours"] });
    },
    onError: (error: Error) => {
      console.error("Error toggling tour status:", error);
    },
  });
}
