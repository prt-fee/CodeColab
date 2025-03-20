
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          
          const userObj = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || userData?.name || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || userData?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
          };
          
          setUser(userObj);
          localStorage.setItem('projectify_user', JSON.stringify(userObj));
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive"
          });
        }
      } else {
        setUser(null);
        localStorage.removeItem('projectify_user');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userObj = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || userData.name,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || userData.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        
        setUser(userObj);
        localStorage.setItem('projectify_user', JSON.stringify(userObj));
      } else {
        // If user document doesn't exist in Firestore, create one
        const userObj = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || email.split('@')[0],
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg',
          createdAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', firebaseUser.uid), userObj);
        setUser(userObj);
        localStorage.setItem('projectify_user', JSON.stringify(userObj));
      }
      
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update display name
      await updateProfile(firebaseUser, { displayName: name });
      
      // Create user document in Firestore
      const userObj = {
        id: firebaseUser.uid,
        name: name,
        email: email,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userObj);
      
      setUser(userObj);
      localStorage.setItem('projectify_user', JSON.stringify(userObj));
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('projectify_user');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  // Update user function
  const updateUser = async (updatedUserData) => {
    if (user) {
      try {
        // Update in Firestore
        await setDoc(doc(db, 'users', user.id), updatedUserData, { merge: true });
        
        // Update local state
        const updatedUser = {...user, ...updatedUserData};
        setUser(updatedUser);
        localStorage.setItem('projectify_user', JSON.stringify(updatedUser));
        
        // Update profile in Firebase Auth if needed
        if (updatedUserData.name || updatedUserData.avatar) {
          await updateProfile(auth.currentUser, {
            displayName: updatedUserData.name || user.name,
            photoURL: updatedUserData.avatar || user.avatar
          });
        }
        
        return true;
      } catch (error) {
        console.error('Error updating user:', error);
        toast({
          title: "Error",
          description: "Failed to update user profile",
          variant: "destructive"
        });
        return false;
      }
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading: isLoading, 
      login, 
      register, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
