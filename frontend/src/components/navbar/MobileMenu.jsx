
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const MobileMenu = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 top-16 z-50 bg-background px-4 py-8">
      <nav className="flex flex-col space-y-6">
        <Link 
          to="/" 
          className="font-medium text-lg text-foreground hover:text-primary"
          onClick={onClose}
        >
          Home
        </Link>
        <Link 
          to="/features" 
          className="font-medium text-lg text-foreground hover:text-primary"
          onClick={onClose}
        >
          Features
        </Link>
        <Link 
          to="/pricing" 
          className="font-medium text-lg text-foreground hover:text-primary"
          onClick={onClose}
        >
          Pricing
        </Link>
        <Link 
          to="/contact" 
          className="font-medium text-lg text-foreground hover:text-primary"
          onClick={onClose}
        >
          Contact
        </Link>
        
        <div className="pt-6 border-t border-border flex flex-col space-y-4">
          {isAuthenticated ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate('/dashboard');
                  onClose();
                }}
                className="w-full"
              >
                Dashboard
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate('/login');
                  onClose();
                }}
                className="w-full"
              >
                Login
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  navigate('/register');
                  onClose();
                }}
                className="w-full"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
