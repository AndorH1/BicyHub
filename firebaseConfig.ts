import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAk_PxVdejaWWZY7mV5BzVYlvWvGpv_h4E",
  authDomain: "bicyhub-e12e1.firebaseapp.com",
  projectId: "bicyhub-e12e1",
  storageBucket: "bicyhub-e12e1.appspot.com",
  messagingSenderId: "449306075807",
  appId: "1:449306075807:web:22bdce0c6a4b65830c38aa",
  measurementId: "G-P8TN587K8N",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_STORAGE = getStorage(FIREBASE_APP);
export const provider = new GoogleAuthProvider();
