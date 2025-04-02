
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEcXDRdwLijOZcqakGVELIaPhM55dsLAA",
  authDomain: "code-collab-dedbb.firebaseapp.com",
  databaseURL: "https://code-collab-dedbb-default-rtdb.firebaseio.com",
  projectId: "code-collab-dedbb",
  storageBucket: "code-collab-dedbb.firebasestorage.app",
  messagingSenderId: "239531618637",
  appId: "1:239531618637:web:f24724b61e53a7048a8704",
  measurementId: "G-3FPFPW0VZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, auth, database, storage, analytics };
