import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBurwKhFJL5Dkt_f5R_FAJFdsIz0QhJBEo",
  authDomain: "quarz-group.firebaseapp.com",
  projectId: "quarz-group",
  storageBucket: "quarz-group.firebasestorage.app",
  messagingSenderId: "1065709368788",
  appId: "1:1065709368788:web:7c43a3a1cf266706db1241"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
