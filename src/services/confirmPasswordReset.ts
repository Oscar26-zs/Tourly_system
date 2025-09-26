import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../config/firebase";

/**
 * Verifica que el código de reset sea válido
 * @param code Código de reset recibido por email
 * @returns Promise<string> Email del usuario si es válido
 * @throws Error con mensaje específico si el código es inválido
 */
export const verifyResetCode = async (code: string): Promise<string> => {
  try {
    const email = await verifyPasswordResetCode(auth, code);
    return email;
  } catch (error: any) {
    switch (error.code) {
      case 'auth/invalid-action-code':
        throw new Error("Código de recuperación inválido o expirado");
      case 'auth/expired-action-code':
        throw new Error("El código de recuperación ha expirado. Solicita uno nuevo");
      case 'auth/user-disabled':
        throw new Error("Esta cuenta ha sido deshabilitada");
      case 'auth/user-not-found':
        throw new Error("No se encontró una cuenta asociada a este código");
      default:
        throw new Error(`Error al verificar el código: ${error.message || 'Código inválido'}`);
    }
  }
};

/**
 * Confirma el reset de contraseña con el nuevo password
 * @param code Código de reset recibido por email
 * @param newPassword Nueva contraseña del usuario
 * @returns Promise<void>
 * @throws Error con mensaje específico según el tipo de error
 */
export const confirmPasswordResetWithCode = async (code: string, newPassword: string): Promise<void> => {
  try {
    await confirmPasswordReset(auth, code, newPassword);
  } catch (error: any) {
    switch (error.code) {
      case 'auth/invalid-action-code':
        throw new Error("Código de recuperación inválido o expirado");
      case 'auth/expired-action-code':
        throw new Error("El código de recuperación ha expirado. Solicita uno nuevo");
      case 'auth/weak-password':
        throw new Error("La contraseña es muy débil. Debe tener al menos 6 caracteres");
      case 'auth/user-disabled':
        throw new Error("Esta cuenta ha sido deshabilitada");
      case 'auth/user-not-found':
        throw new Error("No se encontró una cuenta asociada a este código");
      default:
        throw new Error(`Error al restablecer la contraseña: ${error.message || 'Inténtalo más tarde'}`);
    }
  }
};