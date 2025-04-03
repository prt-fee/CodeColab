
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  loginWithEmailPassword, 
  registerWithEmailPassword, 
  logoutUser, 
  getUserData,
  subscribeToAuthChanges,
  updateUserProfile
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
    console.log("AuthProvider: Checking authentication status");
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setIsLoading(true);
      try {
        if (firebaseUser) {
          console.log("AuthProvider: User is logged in:", firebaseUser.uid);
          const userDetails = await getUserData(firebaseUser);
          setUser(userDetails);
          saveUser(userDetails);
        } else {
          console.log("AuthProvider: No user logged in");
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

    // Clean up subscription on unmount
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
      
      navigate('/dashboard');
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
  const updateUser = async (updatedUserData) => {
    if (!user) return false;
    
    try {
      await updateUserProfile(user.id, updatedUserData);
      const updatedUser = {...user, ...updatedUserData};
      setUser(updatedUser);
      saveUser(updatedUser);
      
      showSuccessToast(
        "Profile updated",
        "Your profile has been successfully updated"
      );
      
      return true;
    } catch (error) {
      showErrorToast(
        "Update failed",
        error.message || "Could not update profile"
      );
      return false;
    }
  };

  // Context value
  const contextValue = {
    user, 
    isAuthenticated: !!user, 
    loading: isLoading, 
    login, 
    register, 
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
