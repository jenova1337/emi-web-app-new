// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACASp8Yk5l0c0AH-HJjfaBocXk_sit6WY",
  authDomain: "emi-tracker-e3771.firebaseapp.com",
  projectId: "emi-tracker-e3771",
  storageBucket: "emi-tracker-e3771.appspot.com", // ✅ corrected domain
  messagingSenderId: "744538139343",
  appId: "1:744538139343:web:74c881b8bacc557d59a5ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);
