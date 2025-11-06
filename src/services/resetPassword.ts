import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../app/config/firebase";
import i18n from '../app/config/i18n';

/**
 * Envía un email de recuperación de contraseña al usuario
 * @param email Email del usuario que quiere recuperar su contraseña
 * @returns Promise<void>
 * @throws Error con mensaje específico según el tipo de error
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email, {
      // Configuración para manejar el reset en nuestra propia aplicación
      url: `${window.location.origin}/reset-password`, // URL a nuestra página personalizada
      handleCodeInApp: true // El código se manejará en nuestra aplicación
    });
  } catch (error: any) {
    // Manejo específico de errores de Firebase — usar traducciones definidas en locales
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error(i18n.t('services.resetPassword.noAccount'));
      case 'auth/invalid-email':
        throw new Error(i18n.t('services.resetPassword.invalidEmail'));
      case 'auth/too-many-requests':
        throw new Error(i18n.t('services.resetPassword.tooManyRequests'));
      case 'auth/network-request-failed':
        throw new Error(i18n.t('services.resetPassword.networkError'));
      default:
        throw new Error(i18n.t('services.resetPassword.genericError', { message: error.message || i18n.t('services.resetPassword.tryLater') }));
    }
  }
};