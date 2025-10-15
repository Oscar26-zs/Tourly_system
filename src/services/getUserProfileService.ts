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
    
    const parseDate = (val: any): Date | undefined => {
      if (!val) return undefined;
      // Firestore Timestamp has toDate()
      if (typeof val?.toDate === 'function') return val.toDate();
      // ISO string
      if (typeof val === 'string') {
        const d = new Date(val);
        return isNaN(d.getTime()) ? undefined : d;
      }
      // number (milliseconds since epoch)
      if (typeof val === 'number') {
        const d = new Date(val);
        return isNaN(d.getTime()) ? undefined : d;
      }
      // Date instance
      if (val instanceof Date) return val;
      return undefined;
    };

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
      fechaCreacion: parseDate(userData.fechaCreacion),
      fechaActualizacion: parseDate(userData.fechaActualizacion),
    } as UserProfile;

  } catch (error) {
    console.error('Error al obtener el perfil del usuario por ID:', error);
    throw error;
  }
};