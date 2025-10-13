import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import type { UserProfile, UserProfileEdit } from '../shared/types/userProfile';

// Servicio para obtener el perfil del usuario actual
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const userDocRef = doc(db, 'usuarios', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado en la base de datos');
    }

    const userData = userDoc.data();
    
    return {
      idUsuario: userDoc.id,
      nombreCompleto: userData.nombreCompleto || '',
      email: userData.email || currentUser.email || '',
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
    console.error('Error al obtener el perfil del usuario:', error);
    throw error;
  }
};

// Servicio para obtener un usuario por ID específico
export const getUserProfileById = async (userId: string): Promise<UserProfile | null> => {
  try {
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

// Servicio para actualizar el perfil del usuario
export const updateUserProfile = async (profileData: UserProfileEdit): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
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

    await updateDoc(userDocRef, updateData);
    
  } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    throw error;
  }
};

// Servicio para verificar si un email ya existe (excluyendo el usuario actual)
export const checkEmailExists = async (email: string, excludeUserId?: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, 'usuarios');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    // Si se proporciona un ID de usuario para excluir, verificar que no sea el mismo
    if (excludeUserId) {
      return querySnapshot.docs.some(doc => doc.id !== excludeUserId);
    }
    
    return !querySnapshot.empty;
    
  } catch (error) {
    console.error('Error al verificar si el email existe:', error);
    throw error;
  }
};

// Servicio para obtener usuarios por rol (útil para admin)
export const getUsersByRole = async (roleId: number): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, 'usuarios');
    const q = query(usersRef, where('idRol', '==', roleId));
    const querySnapshot = await getDocs(q);
    
    const users: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        idUsuario: doc.id,
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
      } as UserProfile);
    });
    
    return users;
    
  } catch (error) {
    console.error('Error al obtener usuarios por rol:', error);
    throw error;
  }
};