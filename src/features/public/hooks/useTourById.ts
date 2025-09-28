import { useQuery } from "@tanstack/react-query";
import { getTourById } from "../services/getTourById";

export function useTourById(tourId: string) {
  return useQuery({
    queryKey: ['tours', tourId],
    queryFn: () => getTourById(tourId),
    enabled: !!tourId && tourId !== '',
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
}