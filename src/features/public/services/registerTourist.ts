import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../../../app/config/firebase";
import type { User } from "../../../shared/types/users";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

import { signInWithPopup, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export async function registerTourist(userData: Omit<User, "idUsuario" | "activo"> & { contrasena: string }) {
  // Crear usuario en Auth
  let userCredential;
  try {
    userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.contrasena);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error creating auth user (tourist):', {
      code: (error as any)?.code,
      message: (error as any)?.message,
      raw: error,
    });
    throw error;
  }

  // Guardar datos en Firestore
  const userDoc: User = {
    idUsuario: Date.now(), // Genera un número único
    nombreCompleto: userData.nombreCompleto,
    email: userData.email,
    contrasena: userData.contrasena,
    telefono: userData.telefono,
    genero: userData.genero,
    fotoPerfil: userData.fotoPerfil,
    descripcion: userData.descripcion,
    activo: true,
    idRol: 1, // Turista
  };

  await setDoc(doc(db, "usuarios", userCredential.user.uid), userDoc);
  

  return userCredential.user;
}

// Sign in with Google (returns google user data)
export async function registerTouristWithGoogle() {
  try {
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error) {
    // Mejor logging para diagnóstico
    // eslint-disable-next-line no-console
    console.error('Error during Google registration (tourist):', {
      code: (error as any)?.code,
      message: (error as any)?.message,
      customData: (error as any)?.customData,
      raw: error,
    });

    // Si el popup fue cancelado o el entorno no soporta popup, hacer fallback a redirect
    const code = (error as any)?.code;
    if (
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/operation-not-supported-in-this-environment'
    ) {
      try {
        // eslint-disable-next-line no-console
        console.info('Falling back to signInWithRedirect due to popup issue');
        await signInWithRedirect(auth, googleProvider);
        return { redirect: true };
      } catch (redirectError) {
        // eslint-disable-next-line no-console
        console.error('Redirect fallback also failed:', redirectError);
        throw redirectError;
      }
    }

    throw error;
  }
}

// Complete registration for users authenticated with Google — saves Firestore doc with tourist role
export async function completeGoogleTouristRegistration(userUid: string, userData: Omit<User, "idUsuario" | "activo">) {
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
    idRol: 1, // Turista
  };
  await setDoc(doc(db, 'usuarios', userUid), userDoc, { merge: true });
  return userDoc;
}