// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACASp8Yk5l0c0AH-HJjfaBocXk_sit6WY",
  authDomain: "emi-tracker-e3771.firebaseapp.com",
  projectId: "emi-tracker-e3771",
  storageBucket: "emi-tracker-e3771.appspot.com", // ✅ corrected domain
  messagingSenderId: "744538139343",
  appId: "1:744538139343:web:74c881b8bacc557d59a5ba"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Enable offline sync
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn("Persistence failed: Multiple tabs open");
  } else if (err.code === 'unimplemented') {
    console.warn("Persistence not supported in this browser");
  }
});

export { auth, db };