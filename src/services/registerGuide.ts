import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../config/firebase";
import type { User } from "../shared/types/users";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

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