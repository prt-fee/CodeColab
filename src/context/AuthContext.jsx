
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import useLocalStorage from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

// Mock user for testing if needed
const MOCK_USER = {
  id: 'mockuser123',
  name: 'Test User',
  email: 'test@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
};

// Create context
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const { saveUser, getUser, clearAllData } = useLocalStorage();

  // Load user from localStorage first, then check Firebase auth status
  useEffect(() => {
    if (initialized) return; // Prevent multiple initializations
    
    setLoading(true);
    let unsubscribe = () => {};
    
    try {
      // First try to load from localStorage for immediate UI feedback
      const localUser = getUser();
      if (localUser) {
        console.log('User found in localStorage:', localUser.id);
        setUser(localUser);
      }
      
      // Then subscribe to Firebase auth state changes
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log("Auth state changed:", firebaseUser ? "user logged in" : "no user");
        
        if (firebaseUser) {
          const userData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
          };
          
          setUser(userData);
          saveUser(userData);
        } else {
          // If no Firebase user but we have localStorage user, clear it
          if (user) {
            console.log('Clearing localStorage user as Firebase has no authenticated user');
            setUser(null);
            saveUser(null);
          }
        }
        
        setLoading(false);
        setInitialized(true);
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      setLoading(false);
      setInitialized(true);
    }
    
    // Cleanup subscription
    return () => unsubscribe();
  }, [initialized]);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      // For demo/testing, allow a special test account
      if (email === 'test@example.com' && password === 'password123') {
        setUser(MOCK_USER);
        saveUser(MOCK_USER);
        toast({
          title: 'Login Successful',
          description: 'Welcome back! (Test Account)',
        });
        navigate('/dashboard');
        return MOCK_USER;
      }
      
      // Regular Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userData = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      setUser(userData);
      saveUser(userData);
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
      navigate('/dashboard');
      
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'Please check your credentials',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, saveUser]);

  const register = useCallback(async (name, email, password) => {
    try {
      setLoading(true);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userData = {
        id: firebaseUser.uid,
        name: name || firebaseUser.email.split('@')[0],
        email: firebaseUser.email,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      };
      
      setUser(userData);
      saveUser(userData);
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created',
      });
      navigate('/dashboard');
      
      return userData;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Please check your information',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [navigate, saveUser]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      
      setUser(null);
      clearAllData(); // Clear all localStorage data on logout
      
      toast({
        title: 'Logout Successful',
        description: 'You have been logged out',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Logout Failed',
        description: error.message || 'Please try again',
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [clearAllData, navigate]);

  const updateUserProfile = useCallback(async (profileData) => {
    try {
      // For now, just update the local state
      setUser(prev => ({ ...prev, ...profileData }));
      saveUser({ ...user, ...profileData });
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
      return { ...user, ...profileData };
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Please try again',
        variant: "destructive"
      });
      throw error;
    }
  }, [user, saveUser]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user, 
    loading, 
    isAuthenticated: !!user,
    login, 
    register, 
    logout,
    updateUserProfile
  }), [user, loading, login, register, logout, updateUserProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
