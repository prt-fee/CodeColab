
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Upload,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-4 w-4 mr-2" />,
      showAlways: true,
    },
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      showWhenAuth: true,
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: <FolderKanban className="h-4 w-4 mr-2" />,
      showWhenAuth: true,
    },
    {
      name: 'Tasks',
      path: '/tasks',
      icon: <CheckSquare className="h-4 w-4 mr-2" />,
      showWhenAuth: true,
    },
    {
      name: 'Upload',
      path: '/upload',
      icon: <Upload className="h-4 w-4 mr-2" />,
      showWhenAuth: true,
    },
  ];

  const filteredNavItems = navigationItems.filter(item => 
    item.showAlways || (isAuthenticated && item.showWhenAuth)
  );

  return (
    <header className="fixed w-full bg-background border-b z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <span className="text-primary text-2xl mr-2">●</span>
            <span className="font-bold text-xl">Projectify</span>
          </Link>
          
          <nav className="hidden md:flex ml-8 space-x-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  isActivePath(item.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/60 hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}
          
          <button
            className="ml-4 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                    isActivePath(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/60 hover:text-foreground hover:bg-accent'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              )}
              {isAuthenticated && (
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium flex items-center text-left w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
