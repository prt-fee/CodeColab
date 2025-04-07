
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Firebase configuration
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

// Initialize Firebase - create a singleton to prevent multiple initializations
let app, auth, database, storage, analytics;

try {
  console.log("Initializing Firebase...");
  
  // Initialize Firebase app - only once
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully");
  
  // Initialize Firebase services
  auth = getAuth(app);
  database = getDatabase(app);
  storage = getStorage(app);
  
  // Only initialize analytics in browser environment
  if (typeof window !== 'undefined') {
    try {
      analytics = getAnalytics(app);
      console.log("Firebase analytics initialized successfully");
    } catch (analyticsError) {
      console.warn("Could not initialize Firebase analytics:", analyticsError);
    }
  } else {
    console.log("Firebase initialized in server environment (without analytics)");
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Create placeholders in case Firebase initialization fails
  if (!app) app = { name: "firebase-app-placeholder" };
  if (!auth) auth = { 
    currentUser: null, 
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    }, 
    signInWithEmailAndPassword: () => Promise.reject(new Error("Auth not initialized")) 
  };
  if (!database) database = { 
    ref: () => ({ 
      set: () => Promise.reject(new Error("Database not initialized")),
      on: () => {}, 
      off: () => {} 
    }) 
  };
  if (!storage) storage = {};
  if (!analytics) analytics = { logEvent: () => {} };
}

// Export singleton instances
export { app, auth, database, storage, analytics };
