import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserProfile, getUserProfileById, updateUserProfile, checkEmailExists } from '../../services/userProfileService';
import type { UserProfileEdit } from '../../shared/types/userProfile';

// Query keys para TanStack Query
export const userProfileKeys = {
  all: ['userProfile'] as const,
  current: () => [...userProfileKeys.all, 'current'] as const,
  byId: (id: string) => [...userProfileKeys.all, 'byId', id] as const,
};

// Hook para obtener el perfil del usuario actual
export const useUserProfile = () => {
  return useQuery({
    queryKey: userProfileKeys.current(),
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook para obtener un perfil específico por ID
export const useUserProfileById = (userId: string) => {
  return useQuery({
    queryKey: userProfileKeys.byId(userId),
    queryFn: () => getUserProfileById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
};

// Hook para actualizar el perfil del usuario
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidar la query del perfil actual para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: userProfileKeys.current(),
      });
    },
    onError: (error) => {
      console.error('Error al actualizar el perfil:', error);
    },
  });
};

// Hook para verificar si un email existe
export const useCheckEmailExists = () => {
  return useMutation({
    mutationFn: ({ email, excludeUserId }: { email: string; excludeUserId?: string }) =>
      checkEmailExists(email, excludeUserId),
  });
};

// Hook personalizado que combina datos y acciones para el perfil
export const useUserProfileManager = () => {
  const userProfileQuery = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const checkEmailMutation = useCheckEmailExists();

  const updateProfile = async (profileData: UserProfileEdit) => {
    try {
      await updateProfileMutation.mutateAsync(profileData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  const validateEmail = async (email: string) => {
    try {
      const exists = await checkEmailMutation.mutateAsync({ 
        email, 
        excludeUserId: userProfileQuery.data?.idUsuario 
      });
      return { isValid: !exists, exists };
    } catch (error) {
      return { 
        isValid: false, 
        exists: false, 
        error: error instanceof Error ? error.message : 'Error al validar email' 
      };
    }
  };

  return {
    // Datos
    userProfile: userProfileQuery.data,
    isLoading: userProfileQuery.isLoading,
    error: userProfileQuery.error,
    isError: userProfileQuery.isError,
    
    // Estados de las mutaciones
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.error,
    isCheckingEmail: checkEmailMutation.isPending,
    
    // Acciones
    updateProfile,
    validateEmail,
    refetchProfile: userProfileQuery.refetch,
    
    // Para usar directamente las mutaciones si es necesario
    updateProfileMutation,
    checkEmailMutation,
  };
};