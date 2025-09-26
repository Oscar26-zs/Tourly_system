import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

export const logoutService = async () => {
  try {
    await signOut(auth);
    console.log('Usuario cerró sesión exitosamente');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};