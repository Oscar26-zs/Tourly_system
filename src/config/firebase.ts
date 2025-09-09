import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBgav6ZfJ0xI1wSeRKdntXCI2GS64ouNOg",
  authDomain: "tourly-6e2a8.firebaseapp.com",
  projectId: "tourly-6e2a8",
  storageBucket: "tourly-6e2a8.appspot.com",
  messagingSenderId: "217329461679",
  appId: "1:217329461679:web:public" // Reemplaza "public" por el valor real de appId si lo tienes
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;