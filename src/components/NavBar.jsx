
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-primary text-2xl">●</span>
              <span className="text-xl font-semibold">Projectify</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link to="/projects" className="text-sm font-medium hover:text-primary">
              Projects
            </Link>
            <Link to="/tasks" className="text-sm font-medium hover:text-primary">
              Tasks
            </Link>
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                      <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="bg-background px-4 pt-2 pb-3 border-t">
            <Link
              to="/dashboard"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Projects
            </Link>
            <Link
              to="/tasks"
              className="block py-2 text-base font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Tasks
            </Link>
            
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/profile"
                  className="block py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-base font-medium hover:text-primary"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link
                  to="/register"
                  className="block w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
