// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDFgYZwc7gZuBfombUYQ9mMVa6gfkJVGs4",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "gestordegastos-afff6.firebaseapp.com",
  databaseURL: "https://gestordegastos-afff6-default-rtdb.firebaseio.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "gestordegastos-afff6",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "gestordegastos-afff6.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "993733253098",
  appId: process.env.FIREBASE_APP_ID || "1:993733253098:web:070c9b105504d13f818493",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-JV0VLQ3P5Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { app, analytics, db };
