
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data from localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Default user for demo purposes
    if (!storedUser) {
      const defaultUser = {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: 'https://i.pravatar.cc/150?img=30'
      };
      localStorage.setItem('user', JSON.stringify(defaultUser));
      setUser(defaultUser);
    }
    
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // In a real app, this would validate with a backend
    if (email && password) {
      const userData = {
        id: '1',
        name: 'Demo User',
        email: email,
        avatar: 'https://i.pravatar.cc/150?img=30'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate to dashboard after successful login
      navigate('/dashboard');
      
      return true;
    }
    
    toast({
      title: "Login failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    
    return false;
  };

  const register = (name, email, password) => {
    // In a real app, this would register with a backend
    if (name && email && password) {
      const userData = {
        id: '1',
        name: name,
        email: email,
        avatar: 'https://i.pravatar.cc/150?img=30'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Registration successful",
        description: "Account created successfully",
      });
      
      // Navigate to dashboard after successful registration
      navigate('/dashboard');
      
      return true;
    }
    
    toast({
      title: "Registration failed",
      description: "Please fill all required fields",
      variant: "destructive",
    });
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    // Navigate to home or login page after logout
    navigate('/');
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
