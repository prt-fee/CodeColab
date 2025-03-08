
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { toast } from "@/hooks/use-toast";

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
      try {
        setIsLoading(true);
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear any stale user data
        localStorage.removeItem('projectify_user');
      } finally {
        setIsLoading(false);
      }
    };

    const storedUser = localStorage.getItem('projectify_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await authAPI.login({ email, password });
      setUser(userData);
      localStorage.setItem('projectify_user', JSON.stringify(userData));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
      navigate('/dashboard');
      return userData;
    } catch (error) {
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
      const userData = await authAPI.register({ name, email, password });
      setUser(userData);
      localStorage.setItem('projectify_user', JSON.stringify(userData));
      toast({
        title: "Registration Successful",
        description: `Welcome to Projectify, ${userData.name}!`,
      });
      navigate('/dashboard');
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('projectify_user');
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      register, 
      logout 
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
