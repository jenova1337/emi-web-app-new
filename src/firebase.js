// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth }       from "firebase/auth";
import { getFirestore }  from "firebase/firestore";

// ⬇️ Firebase Console → Project Settings → General → “Web app” config‑ஐ இங்கு paste செய்யவும்
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "emi-tracker-pro.firebaseapp.com",
  projectId: "emi-tracker-pro",
  storageBucket: "emi-tracker-pro.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
