import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCZulCHZXrswrBckpqsoR9qh5h556mYmX8",
  authDomain: "prueba-8531f.firebaseapp.com",
  databaseURL: "https://prueba-8531f-default-rtdb.firebaseio.com",
  projectId: "prueba-8531f",
  storageBucket: "prueba-8531f.appspot.com",
  messagingSenderId: "440572244096",
  appId: "1:440572244096:web:308793917d33c1a9a23665",
  measurementId: "G-0Z5TH7JSR0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();