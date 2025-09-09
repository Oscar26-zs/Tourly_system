import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebaseApp from "../config/firebase";
import type { User } from "../shared/types/users";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

export async function registerTourist(userData: Omit<User, "idUsuario" | "activo"> & { contrasena: string }) {
  // Crear usuario en Auth
  const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.contrasena);

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