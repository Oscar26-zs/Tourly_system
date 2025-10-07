import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile, updateUserEmail, updateUserPassword, validateCurrentPassword } from '../../services/updateUserProfileService';
import { userProfileKeys } from './useUserProfileById';
import type { UserProfileEdit } from '../types/userProfile';

// Hook para actualizar el perfil del usuario
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      // Invalidar la query del perfil para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: userProfileKeys.all,
      });
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    },
  });
};

// Hook para actualizar el email del usuario
export const useUpdateUserEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newEmail, currentPassword }: { newEmail: string; currentPassword: string }) =>
      updateUserEmail(newEmail, currentPassword),
    onSuccess: () => {
      // Invalidar la query del perfil para refrescar los datos
      queryClient.invalidateQueries({
        queryKey: userProfileKeys.all,
      });
    },
    onError: (error) => {
      console.error('Error updating email:', error);
    },
  });
};

// Hook para actualizar la contraseña del usuario
export const useUpdateUserPassword = () => {
  return useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      updateUserPassword(currentPassword, newPassword),
    onError: (error) => {
      console.error('Error updating password:', error);
    },
  });
};

// Hook para validar la contraseña actual
export const useValidatePassword = () => {
  return useMutation({
    mutationFn: validateCurrentPassword,
    onError: (error) => {
      console.error('Error validating password:', error);
    },
  });
};

// Hook principal que combina todas las funcionalidades de edición
export const useUserProfileEditor = () => {
  const updateProfileMutation = useUpdateUserProfile();
  const updateEmailMutation = useUpdateUserEmail();
  const updatePasswordMutation = useUpdateUserPassword();
  const validatePasswordMutation = useValidatePassword();

  // Función para actualizar el perfil básico
  const updateProfile = async (profileData: UserProfileEdit) => {
    try {
      await updateProfileMutation.mutateAsync(profileData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  };

  // Función para actualizar el email
  const updateEmail = async (newEmail: string, currentPassword: string) => {
    try {
      await updateEmailMutation.mutateAsync({ newEmail, currentPassword });
      return { 
        success: true, 
        message: 'Verification email sent! Please check your inbox and click the verification link to complete the email change.' 
      };
    } catch (error) {
      let errorMessage = 'Failed to send verification email';
      
      if (error instanceof Error) {
        if (error.message.includes('auth/wrong-password')) {
          errorMessage = 'Current password is incorrect';
        } else if (error.message.includes('auth/email-already-in-use')) {
          errorMessage = 'This email is already in use';
        } else if (error.message.includes('auth/invalid-email')) {
          errorMessage = 'Invalid email format';
        } else if (error.message.includes('auth/operation-not-allowed')) {
          errorMessage = 'Email change operation is not allowed. Please contact support.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Función para actualizar la contraseña
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await updatePasswordMutation.mutateAsync({ currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      let errorMessage = 'Failed to update password';
      
      if (error instanceof Error) {
        if (error.message.includes('auth/wrong-password')) {
          errorMessage = 'Current password is incorrect';
        } else if (error.message.includes('auth/weak-password')) {
          errorMessage = 'New password is too weak';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Función para validar la contraseña actual
  const validatePassword = async (password: string) => {
    try {
      const isValid = await validatePasswordMutation.mutateAsync(password);
      return { isValid, error: null };
    } catch (error) {
      return { 
        isValid: false, 
        error: error instanceof Error ? error.message : 'Failed to validate password' 
      };
    }
  };

  return {
    // Estados de las mutaciones
    isUpdatingProfile: updateProfileMutation.isPending,
    isUpdatingEmail: updateEmailMutation.isPending,
    isUpdatingPassword: updatePasswordMutation.isPending,
    isValidatingPassword: validatePasswordMutation.isPending,
    
    // Errores
    profileError: updateProfileMutation.error,
    emailError: updateEmailMutation.error,
    passwordError: updatePasswordMutation.error,
    validationError: validatePasswordMutation.error,
    
    // Funciones de acción
    updateProfile,
    updateEmail,
    updatePassword,
    validatePassword,
    
    // Estados combinados
    isLoading: updateProfileMutation.isPending || 
               updateEmailMutation.isPending || 
               updatePasswordMutation.isPending || 
               validatePasswordMutation.isPending,
    
    // Mutaciones directas (por si se necesitan)
    updateProfileMutation,
    updateEmailMutation,
    updatePasswordMutation,
    validatePasswordMutation,
  };
};