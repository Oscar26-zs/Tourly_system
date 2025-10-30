import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/getCategories";
import type { Category } from "../types/category";

export function useCategories() {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}