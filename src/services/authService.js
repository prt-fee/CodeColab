
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from '@/services/firebase';

// Get user data from database or create if doesn't exist
export const getUserData = async (firebaseUser) => {
  if (!firebaseUser) return null;
  
  try {
    console.log("Getting user data for:", firebaseUser.uid);
    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      console.log("User data found in database");
      const userData = snapshot.val();
      return {
        id: firebaseUser.uid,
        name: userData.name || firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: userData.avatar || firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
      };
    } else {
      console.log("User data not found, creating new entry");
      // Create user data if it doesn't exist in database
      const userDetails = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: new Date().toISOString()
      };
      
      await set(userRef, userDetails);
      return userDetails;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    // Return basic user info even if database operation fails
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
      email: firebaseUser.email,
      avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
    };
  }
};

// Login with email and password
export const loginWithEmailPassword = async (email, password) => {
  try {
    console.log("Attempting login with:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    console.log("Login successful for user:", firebaseUser.uid);
    
    try {
      return await getUserData(firebaseUser);
    } catch (dbError) {
      console.error('Error getting user data after login:', dbError);
      // Fallback to basic user info if database fails
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0],
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    let message = "Login failed. Please check your credentials.";
    if (error.code === 'auth/invalid-credential') {
      message = "Invalid email or password. Please try again.";
    } else if (error.code === 'auth/user-not-found') {
      message = "No account found with this email. Please register.";
    } else if (error.code === 'auth/wrong-password') {
      message = "Incorrect password. Please try again.";
    } else if (error.code === 'auth/too-many-requests') {
      message = "Too many failed login attempts. Please try again later.";
    } else if (error.code === 'auth/user-disabled') {
      message = "This account has been disabled. Please contact support.";
    } else if (error.code === 'auth/network-request-failed') {
      message = "Network error. Please check your connection and try again.";
    }
    const enhancedError = new Error(message);
    enhancedError.code = error.code;
    throw enhancedError;
  }
};

// Register with name, email and password
export const registerWithEmailPassword = async (name, email, password) => {
  try {
    console.log("Attempting registration for:", email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update profile with name
    await updateProfile(firebaseUser, {
      displayName: name
    });
    
    // Create user data in database
    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const userDetails = {
      id: firebaseUser.uid,
      name: name,
      email: email,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      createdAt: new Date().toISOString()
    };
    
    try {
      await set(userRef, userDetails);
      console.log("Registration successful for user:", firebaseUser.uid);
      return userDetails;
    } catch (dbError) {
      console.error('Error saving user data after registration:', dbError);
      // Return user info even if database save fails
      return {
        id: firebaseUser.uid,
        name: name,
        email: email,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    let message = "Registration failed. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      message = "Email is already in use. Please use a different email or try to login.";
    } else if (error.code === 'auth/invalid-email') {
      message = "Invalid email address format.";
    } else if (error.code === 'auth/weak-password') {
      message = "Password is too weak. It should be at least 6 characters.";
    } else if (error.code === 'auth/network-request-failed') {
      message = "Network error. Please check your connection and try again.";
    }
    const enhancedError = new Error(message);
    enhancedError.code = error.code;
    throw enhancedError;
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    console.log("Attempting logout");
    await signOut(auth);
    console.log("Logout successful");
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    console.log("Sending password reset email to:", email);
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    let message = "Failed to send password reset email.";
    if (error.code === 'auth/user-not-found') {
      message = "No account found with this email.";
    } else if (error.code === 'auth/invalid-email') {
      message = "Invalid email address format.";
    } else if (error.code === 'auth/too-many-requests') {
      message = "Too many requests. Please try again later.";
    }
    const enhancedError = new Error(message);
    enhancedError.code = error.code;
    throw enhancedError;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    console.log("Updating profile for user:", userId);
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, userData);
    
    // If we have display name update in Firebase Auth too
    if (userData.name && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: userData.name
      });
    }
    
    // If we have avatar update in Firebase Auth too
    if (userData.avatar && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        photoURL: userData.avatar
      });
    }
    
    console.log("Profile updated successfully");
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback) => {
  console.log("Setting up auth state listener");
  return onAuthStateChanged(auth, callback);
};

// Create a test user for demonstration purposes
export const createTestUser = async () => {
  const testEmail = "test@example.com";
  const testPassword = "password123";
  const testName = "Test User";
  
  try {
    // Check if user already exists
    try {
      const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPassword);
      console.log("Test user already exists, signing out");
      await signOut(auth);
      return;
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        console.log("Test user exists but can't sign in, creating new test user");
      }
    }
    
    // Create the test user
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const firebaseUser = userCredential.user;
    
    // Update profile
    await updateProfile(firebaseUser, {
      displayName: testName
    });
    
    // Save in database
    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const userDetails = {
      id: firebaseUser.uid,
      name: testName,
      email: testEmail,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      createdAt: new Date().toISOString()
    };
    
    await set(userRef, userDetails);
    console.log("Test user created successfully");
    
    // Sign out after creating
    await signOut(auth);
  } catch (error) {
    console.error("Error creating test user:", error);
  }
};
