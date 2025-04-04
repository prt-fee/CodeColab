import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/firebaseAPI';
import useLocalStorage from '@/hooks/useLocalStorage';
import { showSuccessToast, showErrorToast } from '@/services/toastService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { saveUser, getUser, clearAllData } = useLocalStorage();

  // Load user from localStorage first, then check Firebase auth status
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      
      // First try to load from localStorage for immediate UI feedback
      const localUser = getUser();
      if (localUser) {
        console.log('User found in localStorage:', localUser.id);
        setUser(localUser);
      }
      
      try {
        // Then check Firebase auth status
        const currentUser = await authAPI.getCurrentUser();
        
        if (currentUser) {
          console.log('User authenticated in Firebase:', currentUser.id);
          setUser(currentUser);
          saveUser(currentUser);
        } else {
          console.log('No user authenticated in Firebase');
          if (localUser) {
            // If we have a localStorage user but no Firebase user, clear localStorage
            console.log('Clearing localStorage user as Firebase has no authenticated user');
            setUser(null);
            saveUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Keep using localStorage user if Firebase check fails
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getUser, saveUser]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const user = await authAPI.login({ email, password });
      
      setUser(user);
      saveUser(user);
      
      showSuccessToast('Login Successful', 'Welcome back!');
      navigate('/dashboard');
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      showErrorToast('Login Failed', error.message || 'Please check your credentials');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const user = await authAPI.register(userData);
      
      setUser(user);
      saveUser(user);
      
      showSuccessToast('Registration Successful', 'Your account has been created');
      navigate('/dashboard');
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      showErrorToast('Registration Failed', error.message || 'Please check your information');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authAPI.logout();
      
      setUser(null);
      clearAllData(); // Clear all localStorage data on logout
      
      showSuccessToast('Logout Successful', 'You have been logged out');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      showErrorToast('Logout Failed', error.message || 'Please try again');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      // Update user profile here
      // For now, just update the local state
      setUser(prev => ({ ...prev, ...profileData }));
      saveUser({ ...user, ...profileData });
      
      showSuccessToast('Profile Updated', 'Your profile has been updated successfully');
      return { ...user, ...profileData };
    } catch (error) {
      console.error('Update profile error:', error);
      showErrorToast('Update Failed', error.message || 'Please try again');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user,
      login, 
      register, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
