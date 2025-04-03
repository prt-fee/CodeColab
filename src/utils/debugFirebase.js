
import { auth, database } from '../services/firebase';
import { ref, get, set } from 'firebase/database';

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
    console.log("Database read access to /users: Granted");
  } catch (error) {
    console.log("Database read access to /users: Denied", error.message);
  }
  
  // Try to create a test node
  try {
    if (auth.currentUser) {
      const testDataRef = ref(database, `users/${auth.currentUser.uid}/debug`);
      await set(testDataRef, {
        timestamp: new Date().toISOString(),
        testValue: "Test write operation"
      });
      console.log("Database write access: Granted");
      
      // Read it back
      const snapshot = await get(testDataRef);
      console.log("Test data read back:", snapshot.val());
    } else {
      console.log("Database write access: Not tested (no user signed in)");
    }
  } catch (error) {
    console.log("Database write access: Denied", error.message);
  }
  
  // Check projects access
  try {
    const projectsRef = ref(database, 'projects');
    await get(projectsRef);
    console.log("Database read access to /projects: Granted");
  } catch (error) {
    console.log("Database read access to /projects: Denied", error.message);
  }
  
  console.log("==============================");
  console.log("To fix Firebase permission issues, you need to update your Firebase Realtime Database rules in the Firebase Console.");
  console.log("Here are example rules that would work for basic authentication:");
  console.log(`
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || auth.token.admin === true",
        ".write": "$uid === auth.uid || auth.token.admin === true"
      }
    },
    "projects": {
      "$projectId": {
        ".read": "data.child('owner').val() === auth.uid || data.child('members').hasChild(auth.uid)",
        ".write": "data.child('owner').val() === auth.uid || newData.child('owner').val() === auth.uid || data.child('members').hasChild(auth.uid)"
      }
    }
  }
}
  `);
  
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