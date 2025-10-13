import { useQuery } from '@tanstack/react-query';
import { getUserProfileById } from '../../services/getUserProfileService';

// Query keys para TanStack Query
export const userProfileKeys = {
  all: ['userProfile'] as const,
  byId: (id: string) => [...userProfileKeys.all, 'byId', id] as const,
};

// Hook para obtener un perfil específico por ID
export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: userProfileKeys.byId(userId),
    queryFn: () => getUserProfileById(userId),
    enabled: !!userId, // Solo ejecuta la query si hay un userId
    staleTime: 5 * 60 * 1000, // Los datos son "frescos" por 5 minutos
    retry: 2, // Reintenta 2 veces en caso de error
    refetchOnWindowFocus: false, // No refrescar al enfocar la ventana
  });
};