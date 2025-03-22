
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { firebaseAuth } from '@/services/firebase';
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
    const checkAuth = () => {
      const unsubscribe = firebaseAuth.getAuth().onAuthStateChanged((currentUser) => {
        if (currentUser) {
          // Convert Firebase user to our app user format
          const appUser = {
            id: currentUser.uid,
            name: currentUser.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            avatar: currentUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
          };
          setUser(appUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });

      // Clean up subscription
      return () => unsubscribe();
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const firebaseUser = await firebaseAuth.login(email, password);
      
      // Convert Firebase user to our app user format
      const appUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || email.split('@')[0],
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      setUser(appUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    
    try {
      const firebaseUser = await firebaseAuth.register(name, email, password);
      
      // Convert Firebase user to our app user format
      const appUser = {
        id: firebaseUser.uid,
        name: name,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      setUser(appUser);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function - updated to use Firebase
  const logout = async () => {
    try {
      await firebaseAuth.logout();
      setUser(null);
      navigate('/'); // Redirect to index page
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: error.message || "An error occurred during logout",
        variant: "destructive"
      });
    }
  };

  // Update user function
  const updateUser = async (updatedUserData) => {
    if (user) {
      try {
        // Update Firebase profile if needed
        if (updatedUserData.name && firebaseAuth.getCurrentUser()) {
          await firebaseAuth.updateProfile({
            displayName: updatedUserData.name
          });
        }
        
        const updatedUser = {...user, ...updatedUserData};
        setUser(updatedUser);
        return true;
      } catch (error) {
        console.error('Update user error:', error);
        toast({
          title: "Update Error",
          description: error.message || "An error occurred updating profile",
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
