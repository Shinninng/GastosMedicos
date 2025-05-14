// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFgYZwc7gZuBfombUYQ9mMVa6gfkJVGs4",
  authDomain: "gestordegastos-afff6.firebaseapp.com",
  databaseURL: "https://gestordegastos-afff6-default-rtdb.firebaseio.com",
  projectId: "gestordegastos-afff6",
  storageBucket: "gestordegastos-afff6.firebasestorage.app",
  messagingSenderId: "993733253098",
  appId: "1:993733253098:web:070c9b105504d13f818493",
  measurementId: "G-JV0VLQ3P5Y"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { app, analytics, db };
