
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const AuthButtons = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center gap-4">
      {isAuthenticated ? (
        <>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="default" 
            onClick={logout}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            variant="default" 
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
