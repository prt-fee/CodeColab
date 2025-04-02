
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
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
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    return getUserData(firebaseUser);
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register with name, email and password
export const registerWithEmailPassword = async (name, email, password) => {
  try {
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
    return userDetails;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
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

// Listen to auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
