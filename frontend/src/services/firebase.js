// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import { getStorage } from "firebase/storage";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCEcXDRdwLijOZcqakGVELIaPhM55dsLAA",
//   authDomain: "code-collab-dedbb.firebaseapp.com",
//   databaseURL: "https://code-collab-dedbb-default-rtdb.firebaseio.com",
//   projectId: "code-collab-dedbb",
//   storageBucket: "code-collab-dedbb.firebasestorage.app",
//   messagingSenderId: "239531618637",
//   appId: "1:239531618637:web:f24724b61e53a7048a8704",
//   measurementId: "G-3FPFPW0VZQ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const database = getDatabase(app);
// const storage = getStorage(app);

// export { app, auth, database, storage, analytics };


import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEcXDRdwLijOZcqakGVELIaPhM55dsLAA",
  authDomain: "code-collab-dedbb.firebaseapp.com",
  databaseURL: "https://code-collab-dedbb-default-rtdb.firebaseio.com",
  projectId: "code-collab-dedbb",
  storageBucket: "code-collab-dedbb.appspot.com",
  messagingSenderId: "239531618637",
  appId: "1:239531618637:web:f24724b61e53a7048a8704",
  measurementId: "G-3FPFPW0VZQ"
};


// const firebaseConfig = {
//   apiKey: "AIzaSyCUgrfm5StmQSjGqMXbd7lelAbQJYSc_GE",
//   authDomain: "code-collab-42013.firebaseapp.com",
//   databaseURL: "https://code-collab-42013-default-rtdb.firebaseio.com",
//   projectId: "code-collab-42013",
//   storageBucket: "code-collab-42013.firebasestorage.app",
//   messagingSenderId: "482113941412",
//   appId: "1:482113941412:web:5a9ba815645184aa1e9b31"
// };

// Initialize Firebase
console.log("Initializing Firebase...");
let app, auth, database, storage, analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
  storage = getStorage(app);
  
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    console.log("Firebase initialized successfully with analytics");
  } else {
    console.log("Firebase initialized successfully without analytics (server environment)");
  }
  
  // Use emulators if in development and the environment variables are set
  if (process.env.NODE_ENV === 'development') {
    if (process.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
        connectDatabaseEmulator(database, 'localhost', 9000);
        connectStorageEmulator(storage, 'localhost', 9199);
        console.log("Connected to Firebase emulators");
      } catch (emulatorError) {
        console.error("Failed to connect to Firebase emulators:", emulatorError);
      }
    }
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Create placeholders in case Firebase initialization fails
  if (!app) app = {};
  if (!auth) auth = { currentUser: null, onAuthStateChanged: () => {}, signInWithEmailAndPassword: () => Promise.reject(new Error("Auth not initialized")) };
  if (!database) database = { ref: () => ({ set: () => Promise.reject(new Error("Database not initialized")) }) };
  if (!storage) storage = {};
  if (!analytics) analytics = {};
}

export { app, auth, database, storage, analytics };