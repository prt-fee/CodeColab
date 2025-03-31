
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        // Instead of using MOCK_USER, create a user with the provided email
        const loginUser = {
          id: '1',
          name: email.split('@')[0], // Use the part before @ as a simple name
          email: email,
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
        
        setUser(loginUser);
        localStorage.setItem('projectify_user', JSON.stringify(loginUser));
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
        const newUser = {
          id: '1',
          name: name,
          email: email,
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        };
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
