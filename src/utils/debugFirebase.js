
import { auth, database } from '../services/firebase';
import { ref, get } from 'firebase/database';

// This function can be called from the browser console to check Firebase connectivity
export const debugFirebase = async () => {
  console.log("=== Firebase Debug Information ===");
  
  // Check auth state
  console.log("Auth state:", auth.currentUser ? "Logged in" : "Not logged in");
  if (auth.currentUser) {
    console.log("Current user:", {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      emailVerified: auth.currentUser.emailVerified,
      isAnonymous: auth.currentUser.isAnonymous,
      metadata: auth.currentUser.metadata
    });
  }
  
  // Test database connection
  try {
    const testRef = ref(database, '.info/connected');
    const snapshot = await get(testRef);
    console.log("Database connection:", snapshot.val() ? "Connected" : "Not connected");
  } catch (error) {
    console.error("Database connection error:", error);
  }
  
  // Check Firebase rules (this will likely fail if rules are restrictive)
  try {
    const usersRef = ref(database, 'users');
    await get(usersRef);
    console.log("Database read access: Granted");
  } catch (error) {
    console.log("Database read access: Denied", error.message);
  }
  
  console.log("==============================");
  
  return {
    authState: auth.currentUser ? "logged_in" : "logged_out",
    currentUser: auth.currentUser ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName
    } : null
  };
};

// Function to create a test user with preset credentials
export const setupTestUser = async () => {
  // This function is already implemented in authService.js
  // We're just providing this reference here
  console.log("Use createTestUser() from authService.js to create a test user");
};

// To use these functions, open browser console and type:
// import { debugFirebase } from './utils/debugFirebase.js'
// debugFirebase().then(info => console.log(info))
