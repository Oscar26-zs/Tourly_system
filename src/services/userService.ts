import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../app/config/firebase";
import type { User as FirebaseUser } from "firebase/auth";

/**
 * Verifica si existe un documento de usuario en Firestore y lo crea si no existe
 * @param firebaseUser Usuario autenticado de Firebase Auth
 * @returns Datos del usuario desde Firestore
 */
export const ensureUserDocument = async (firebaseUser: FirebaseUser) => {
  try {
    // Primero intentar obtener por UID
    const userDocRef = doc(db, "usuarios", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      console.log("Documento encontrado por UID:", firebaseUser.uid);
      return userDoc.data();
    }
    
    console.log("Documento no encontrado por UID, buscando por email...");
    
    // Si no existe, buscar por email
    const q = query(
      collection(db, "usuarios"), 
      where("email", "==", firebaseUser.email)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      const existingData = existingDoc.data();
      
      console.log("Usuario encontrado por email, actualizando UID...");
      
      // Crear nuevo documento con el UID correcto
      await setDoc(userDocRef, {
        ...existingData,
        uid: firebaseUser.uid, // Asegurar que el UID esté correcto
        email: firebaseUser.email,
        ultimaActualizacion: new Date().toISOString(),
      });
      
      console.log("Documento creado/actualizado con UID:", firebaseUser.uid);
      return existingData;
    }
    
    console.log("Usuario no encontrado en Firestore, creando documento básico...");
    
    // Si no existe ningún documento, crear uno básico
    const newUserData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      nombreCompleto: firebaseUser.displayName || "Usuario",
      idRol: 1, // Por defecto turista
      fechaCreacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString(),
      fotoPerfil: firebaseUser.photoURL || "",
      telefono: "",
      genero: "",
      descripcion: "",
    };
    
    await setDoc(userDocRef, newUserData);
    console.log("Documento básico creado para:", firebaseUser.uid);
    
    return newUserData;
    
  } catch (error) {
    console.error("Error en ensureUserDocument:", error);
    throw error;
  }
};

/**
 * Obtiene los datos del usuario desde Firestore
 * @param firebaseUser Usuario autenticado de Firebase Auth
 * @returns Datos del usuario o null si no se encuentra
 */
export const getUserData = async (firebaseUser: FirebaseUser) => {
  try {
    return await ensureUserDocument(firebaseUser);
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error);
    return null;
  }
};