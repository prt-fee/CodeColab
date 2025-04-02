
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  logoutUser, 
  getUserData,
  subscribeToAuthChanges
} from '@/services/authService';
import useLocalStorage from '@/hooks/useLocalStorage';
import { showSuccessToast, showErrorToast } from '@/services/toastService';

// Create the context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { saveUser, getUser } = useLocalStorage();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setIsLoading(true);
      try {
        if (firebaseUser) {
          const userDetails = await getUserData(firebaseUser);
          setUser(userDetails);
          saveUser(userDetails);
        } else {
          setUser(null);
          saveUser(null);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        saveUser(null);
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
      const userDetails = await loginWithEmailPassword(email, password);
      setUser(userDetails);
      saveUser(userDetails);
      
      showSuccessToast(
        "Login successful",
        "Welcome back!"
      );
      
      return true;
    } catch (error) {
      showErrorToast(
        "Login failed",
        error.message || "Invalid credentials"
      );
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true);
    
    try {
      const userDetails = await registerWithEmailPassword(name, email, password);
      setUser(userDetails);
      saveUser(userDetails);
      
      showSuccessToast(
        "Registration successful",
        "Your account has been created"
      );
      
      navigate('/dashboard');
      return true;
    } catch (error) {
      showErrorToast(
        "Registration failed",
        error.message || "Could not create account"
      );
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      saveUser(null);
      
      showSuccessToast(
        "Logged out",
        "You've been successfully logged out"
      );
      
      navigate('/');
    } catch (error) {
      showErrorToast(
        "Logout failed",
        error.message || "Could not log out"
      );
    }
  };

  // Update user function
  const updateUser = (updatedUserData) => {
    if (user) {
      const updatedUser = {...user, ...updatedUserData};
      setUser(updatedUser);
      saveUser(updatedUser);
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
