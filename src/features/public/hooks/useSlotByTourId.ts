import { useQuery } from "@tanstack/react-query";
import { getSlotsByTourId } from "../services/getSlotByTourId";

export function useSlotsByTour(tourId: string) {
  return useQuery({
    queryKey: ['slots', tourId],
    queryFn: () => getSlotsByTourId(tourId),
    enabled: !!tourId && tourId !== '',
    staleTime: 2 * 60 * 1000, 
    retry: 1,
  });
}