import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDOflhgWbY3dpvSs0icoVOH9uCS16w8Yl8",
  authDomain: "zentry-hub.firebaseapp.com",
  projectId: "zentry-hub",
  storageBucket: "zentry-hub.firebasestorage.app",
  messagingSenderId: "9976842702",
  appId: "1:9976842702:web:83be01d42a4f28390d439f",
  measurementId: "G-TDT1M5PC5B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
