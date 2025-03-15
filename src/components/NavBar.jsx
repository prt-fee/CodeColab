
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  User,
  FolderKanban,
  FileText,
  Upload,
  Calendar
} from 'lucide-react';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { href: '/projects', label: 'Projects', icon: <FolderKanban className="h-4 w-4 mr-2" /> },
    { href: '/tasks', label: 'Tasks', icon: <FileText className="h-4 w-4 mr-2" /> },
    { href: '/meetings', label: 'Meetings', icon: <Calendar className="h-4 w-4 mr-2" /> },
    { href: '/upload', label: 'Deploy', icon: <Upload className="h-4 w-4 mr-2" /> }
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-xl font-bold">
              <FolderKanban className="h-6 w-6 mr-2" />
              ProjectHub
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {user ? (
              <>
                {navLinks.map((link) => (
                  <Button 
                    key={link.href}
                    variant={isActive(link.href) ? "default" : "ghost"}
                    asChild
                  >
                    <Link to={link.href}>
                      {link.icon}
                      {link.label}
                    </Link>
                  </Button>
                ))}
                
                <div className="ml-4 flex items-center">
                  <Button 
                    variant="ghost" 
                    className="flex items-center"
                    onClick={() => navigate('/profile')}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block">{user.name || 'User'}</span>
                  </Button>
                  
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
          
          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 bg-background">
          <nav className="flex flex-col space-y-2">
            {user ? (
              <>
                <div className="flex items-center p-2 mb-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.name || 'User'}</span>
                </div>
                
                {navLinks.map((link) => (
                  <Button 
                    key={link.href}
                    variant={isActive(link.href) ? "default" : "ghost"}
                    className="justify-start"
                    asChild
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to={link.href}>
                      {link.icon}
                      {link.label}
                    </Link>
                  </Button>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="justify-start"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="justify-start text-red-500"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="justify-start"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/login">Login</Link>
                </Button>
                
                <Button 
                  className="justify-start"
                  asChild
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
