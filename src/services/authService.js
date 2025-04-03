
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
    const userRef = ref(database, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return {
        id: firebaseUser.uid,
        name: userData.name || firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: userData.avatar || firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
      };
    } else {
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
    throw error;
  }
};

// Login with email and password
export const loginWithEmailPassword = async (email, password) => {
  try {
    console.log("Attempting login with:", email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    console.log("Login successful for user:", firebaseUser.uid);
    return await getUserData(firebaseUser);
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
    
    await set(userRef, userDetails);
    console.log("Registration successful for user:", firebaseUser.uid);
    return userDetails;
  } catch (error) {
    console.error('Registration error:', error);
    let message = "Registration failed. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      message = "Email is already in use. Please use a different email or try to login.";
    } else if (error.code === 'auth/invalid-email') {
      message = "Invalid email address format.";
    } else if (error.code === 'auth/weak-password') {
      message = "Password is too weak. It should be at least 6 characters.";
    }
    const enhancedError = new Error(message);
    enhancedError.code = error.code;
    throw enhancedError;
  }
};

// Sign out
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    let message = "Failed to send password reset email.";
    if (error.code === 'auth/user-not-found') {
      message = "No account found with this email.";
    } else if (error.code === 'auth/invalid-email') {
      message = "Invalid email address format.";
    }
    const enhancedError = new Error(message);
    enhancedError.code = error.code;
    throw enhancedError;
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
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
    
    return true;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

// Listen to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
