// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuración directa (solución temporal para desarrollo)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDFgYZwc7gZuBfombUYQ9mMVa6gfkJVGs4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gestordegastos-afff6.firebaseapp.com",
  databaseURL: "https://gestordegastos-afff6-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gestordegastos-afff6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gestordegastos-afff6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "993733253098",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:993733253098:web:070c9b105504d13f818493",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JV0VLQ3P5Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { app, analytics, db };
