import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProfile } from '../shared/types/userProfile';

// Servicio para obtener un usuario por ID específico
export const getUserProfileById = async (userId: string): Promise<UserProfile | null> => {
  try {
    if (!userId) {
      throw new Error('ID de usuario requerido');
    }

    const userDocRef = doc(db, 'usuarios', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userDoc.data();
    
    return {
      idUsuario: userDoc.id,
      nombreCompleto: userData.nombreCompleto || '',
      email: userData.email || '',
      telefono: userData.telefono || '',
      genero: userData.genero || 'other',
      fotoPerfil: userData.fotoPerfil || '',
      idRol: userData.idRol || 1,
      activo: userData.activo !== undefined ? userData.activo : true,
      descripcion: userData.descripcion || '',
      fechaCreacion: userData.fechaCreacion?.toDate(),
      fechaActualizacion: userData.fechaActualizacion?.toDate(),
    } as UserProfile;

  } catch (error) {
    console.error('Error al obtener el perfil del usuario por ID:', error);
    throw error;
  }
};