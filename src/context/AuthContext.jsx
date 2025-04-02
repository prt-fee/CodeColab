
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth as firebaseAuth } from '@/services/firebase';
import { authAPI } from '@/services/firebaseAPI';
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
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth check error:", error);
        // If there's an error, clear localStorage as a fallback
        localStorage.removeItem('projectify_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const userDetails = await authAPI.login({ email, password });
      
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
      const userDetails = await authAPI.register({ name, email, password });
      
      setUser(userDetails);
      localStorage.setItem('projectify_user', JSON.stringify(userDetails));
      setIsLoading(false);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
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

  // Logout function - updated to redirect to index page
  const logout = async () => {
    try {
      await authAPI.logout();
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
