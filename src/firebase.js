// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAmyQEYNto-uokpZQrKtlhKjMUHdceh9Ks",
  authDomain: "job-tracker-app-eb7ae.firebaseapp.com",
  projectId: "job-tracker-app-eb7ae",
  storageBucket: "job-tracker-app-eb7ae.appspot.com",
  messagingSenderId: "557107998559",
  appId: "1:557107998559:web:b4894db204ff2b327d10ea"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export authentication instance
export const auth = getAuth(app);
