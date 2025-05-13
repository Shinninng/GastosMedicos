// firebase-config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Importa getDatabase

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Asegúrate que Netlify esté configurado para estas variables
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Corregido nombre (asumiendo typo)
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Corregido nombre
  appId: import.meta.env.VITE_FIREBASE_APP_ID, // Corregido nombre
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Corregido nombre
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app); // Inicializa y obtén la instancia de Realtime Database

// Exporta lo que necesites en otros archivos
export { app, analytics, db };