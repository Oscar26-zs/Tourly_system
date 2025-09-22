import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgav6ZfJ0xI1wSeRKdntXCI2GS64ouNOg",
  authDomain: "tourly-6e2a8.firebaseapp.com",
  projectId: "tourly-6e2a8",
  storageBucket: "tourly-6e2a8.appspot.com",
  messagingSenderId: "217329461679",
  appId: "1:217329461679:web:c7a8e1b2d3f4e5f6g7h8i9" // Este debe ser el appId real de tu proyecto
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inicializar servicios
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export default firebaseApp;