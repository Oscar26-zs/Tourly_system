import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../app/config/firebase";

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
    // Manejo específico de errores de Firebase
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error("No existe una cuenta con este correo electrónico");
      case 'auth/invalid-email':
        throw new Error("Formato de correo electrónico inválido");
      case 'auth/too-many-requests':
        throw new Error("Demasiadas solicitudes. Inténtalo más tarde");
      case 'auth/network-request-failed':
        throw new Error("Error de conexión. Verifica tu internet");
      default:
        throw new Error(`Error al enviar el email: ${error.message || 'Inténtalo más tarde'}`);
    }
  }
};