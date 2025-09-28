import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../config/firebase";
import type { User } from "../shared/types/users";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Completa el registro de guía para usuarios autenticados con Google
export async function completeGoogleGuideRegistration(userUid: string, userData: Omit<User, "idUsuario" | "activo">) {
  // Actualizar datos en Firestore
  const userDoc: User = {
    idUsuario: Date.now(),
    nombreCompleto: userData.nombreCompleto,
    email: userData.email,
    contrasena: userData.contrasena,
    telefono: userData.telefono,
    genero: userData.genero,
    fotoPerfil: userData.fotoPerfil,
    descripcion: userData.descripcion,
    activo: true,
    idRol: 2, // Guía
  };
  await setDoc(doc(db, "usuarios", userUid), userDoc, { merge: true });
  return userDoc;
}

export async function registerGuide(userData: Omit<User, "idUsuario" | "activo"> & { password: string }) {
  // Crear usuario en Auth
  const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

  // Guardar datos en Firestore
  const userDoc: User = {
    idUsuario: Date.now(), 
    nombreCompleto: userData.nombreCompleto,
    email: userData.email,
    contrasena: userData.contrasena,
    telefono: userData.telefono,
    genero: userData.genero,
    fotoPerfil: userData.fotoPerfil,
    descripcion: userData.descripcion,
    activo: true,
    idRol: 2, // Guía
  };

  await setDoc(doc(db, "usuarios", userCredential.user.uid), userDoc);

  return userCredential.user;
}

export async function registerGuideWithGoogle() {
  try {
    // Configurar el proveedor de Google
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Iniciar sesión con Google
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Solo retornar los datos del usuario de Google, sin crear documento en Firestore
    return { user };
  } catch (error) {
    console.error("Error during Google registration:", error);
    throw error;
  }
}