
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext(null);

// Initial mock user data
const MOCK_USER = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('projectify_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = (email, password) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would validate credentials with your API
      if (email && password) {
        setUser(MOCK_USER);
        localStorage.setItem('projectify_user', JSON.stringify(MOCK_USER));
        setIsLoading(false);
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = (name, email, password) => {
    setIsLoading(true);
    
    try {
      // In a real app, you would register the user with your API
      if (name && email && password) {
        const newUser = { ...MOCK_USER, name, email };
        setUser(newUser);
        localStorage.setItem('projectify_user', JSON.stringify(newUser));
        setIsLoading(false);
        return true;
      } else {
        throw new Error('Invalid registration data');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Logout function - updated to redirect to index page
  const logout = () => {
    setUser(null);
    localStorage.removeItem('projectify_user');
    navigate('/'); // Changed from /login to / (index page)
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading: isLoading, 
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
