
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { auth, database } from '@/services/firebase';
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
      setIsLoading(true);
      try {
        if (firebaseUser) {
          // If user exists in Firebase auth, get additional data from database
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userData = snapshot.val();
            const userDetails = {
              id: firebaseUser.uid,
              name: userData.name || firebaseUser.displayName,
              email: firebaseUser.email,
              avatar: userData.avatar || firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
            };
            
            setUser(userDetails);
            localStorage.setItem('projectify_user', JSON.stringify(userDetails));
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
            setUser(userDetails);
            localStorage.setItem('projectify_user', JSON.stringify(userDetails));
          }
        } else {
          // If no user, clear state and localStorage
          setUser(null);
          localStorage.removeItem('projectify_user');
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem('projectify_user');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get additional user data from database
      const userRef = ref(database, `users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);
      
      let userDetails;
      if (snapshot.exists()) {
        const userData = snapshot.val();
        userDetails = {
          id: firebaseUser.uid,
          name: userData.name || firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: userData.avatar || firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
        };
      } else {
        // Create user data if it doesn't exist
        userDetails = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || email.split('@')[0],
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg',
          createdAt: new Date().toISOString()
        };
        await set(userRef, userDetails);
      }
      
      setUser(userDetails);
      localStorage.setItem('projectify_user', JSON.stringify(userDetails));
      setIsLoading(false);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
      
      throw error;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update profile
      await updateProfile(firebaseUser, {
        displayName: name
      });
      
      // Save additional user data
      const userRef = ref(database, `users/${firebaseUser.uid}`);
      const userDetails = {
        id: firebaseUser.uid,
        name: name,
        email: email,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        createdAt: new Date().toISOString()
      };
      
      await set(userRef, userDetails);
      
      setUser(userDetails);
      localStorage.setItem('projectify_user', JSON.stringify(userDetails));
      setIsLoading(false);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive"
      });
      
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('projectify_user');
      
      toast({
        title: "Logged out",
        description: "You've been successfully logged out",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      
      toast({
        title: "Logout failed",
        description: error.message || "Could not log out",
        variant: "destructive"
      });
    }
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    if (user) {
      const updatedUser = {...user, ...updatedUserData};
      setUser(updatedUser);
      localStorage.setItem('projectify_user', JSON.stringify(updatedUser));
      return true;
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
