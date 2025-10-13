import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, verifyBeforeUpdateEmail, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import type { UserProfileEdit } from '../shared/types/userProfile';

// Servicio para actualizar el perfil del usuario
export const updateUserProfile = async (profileData: UserProfileEdit): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No authenticated user found');
    }

    const userDocRef = doc(db, 'usuarios', currentUser.uid);
    
    // Preparar los datos para actualizar (remover campos undefined)
    const updateData: any = {};
    
    if (profileData.nombreCompleto !== undefined) {
      updateData.nombreCompleto = profileData.nombreCompleto;
    }
    if (profileData.telefono !== undefined) {
      updateData.telefono = profileData.telefono;
    }
    if (profileData.genero !== undefined) {
      updateData.genero = profileData.genero;
    }
    if (profileData.fotoPerfil !== undefined) {
      updateData.fotoPerfil = profileData.fotoPerfil;
    }
    if (profileData.descripcion !== undefined) {
      updateData.descripcion = profileData.descripcion;
    }

    // Agregar timestamp de actualización
    updateData.fechaActualizacion = new Date();

    // Actualizar el documento en Firestore
    await updateDoc(userDocRef, updateData);
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Servicio para actualizar el email del usuario
export const updateUserEmail = async (newEmail: string, currentPassword: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No authenticated user found');
    }

    // Reautenticar al usuario antes de cambiar el email
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);

    // Enviar email de verificación antes de cambiar el email
    await verifyBeforeUpdateEmail(currentUser, newEmail);

    // Nota: El email en Firestore se actualizará después de que el usuario confirme 
    // el nuevo email desde el enlace de verificación que recibe por correo
    // Por ahora solo mostramos un mensaje de éxito

  } catch (error) {
    console.error('Error updating user email:', error);
    throw error;
  }
};

// Servicio para actualizar la contraseña del usuario
export const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No authenticated user found');
    }

    // Reautenticar al usuario antes de cambiar la contraseña
    const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
    await reauthenticateWithCredential(currentUser, credential);

    // Actualizar la contraseña en Firebase Auth
    await updatePassword(currentUser, newPassword);

    // Actualizar timestamp en Firestore
    const userDocRef = doc(db, 'usuarios', currentUser.uid);
    await updateDoc(userDocRef, {
      fechaActualizacion: new Date()
    });

  } catch (error) {
    console.error('Error updating user password:', error);
    throw error;
  }
};

// Servicio para validar la contraseña actual
export const validateCurrentPassword = async (password: string): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('No authenticated user found');
    }

    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
    return true;

  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
};