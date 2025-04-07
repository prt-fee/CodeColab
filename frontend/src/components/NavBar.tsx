
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Check if we're on the auth pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  // Check if we're on the main app pages
  const isAppPage = ['/dashboard', '/tasks', '/projects', '/calendar', '/profile'].includes(location.pathname) 
                   || location.pathname.startsWith('/project/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Don't show navbar on auth pages
  if (isAuthPage) return null;

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled || isAppPage 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-semibold flex items-center gap-2 select-none"
        >
          <span className="text-primary text-2xl">●</span>
          <span>ProjectHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === '/' ? "text-primary" : "text-foreground/80"
            )}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === '/features' ? "text-primary" : "text-foreground/80"
            )}
          >
            Features
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === '/about' ? "text-primary" : "text-foreground/80"
            )}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === '/contact' ? "text-primary" : "text-foreground/80"
            )}
          >
            Contact
          </Link>
        </nav>
        
        {/* Auth/App Links */}
        {!isAppPage ? (
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <UserCircle size={16} />
                    {user.name || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="font-medium">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="font-medium">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant={location.pathname === '/dashboard' ? "default" : "ghost"} size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/tasks">
              <Button variant={location.pathname === '/tasks' ? "default" : "ghost"} size="sm">
                Tasks
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant={location.pathname === '/projects' ? "default" : "ghost"} size="sm">
                Projects
              </Button>
            </Link>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <UserCircle size={16} />
                    {user.name || 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-x-0 top-[57px] bg-white/95 backdrop-blur-md z-40 shadow-lg transition-all duration-300 ease-in-out md:hidden overflow-hidden",
        isMobileMenuOpen ? "max-h-[500px] border-b" : "max-h-0"
      )}>
        <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
          <Link 
            to="/" 
            className={cn(
              "py-2 px-3 text-base font-medium rounded-md transition-colors",
              location.pathname === '/' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
            )}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={cn(
              "py-2 px-3 text-base font-medium rounded-md transition-colors",
              location.pathname === '/features' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
            )}
          >
            Features
          </Link>
          <Link 
            to="/about" 
            className={cn(
              "py-2 px-3 text-base font-medium rounded-md transition-colors",
              location.pathname === '/about' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
            )}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={cn(
              "py-2 px-3 text-base font-medium rounded-md transition-colors",
              location.pathname === '/contact' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
            )}
          >
            Contact
          </Link>
          
          <div className="h-px w-full bg-border my-2"></div>
          
          {!isAppPage ? (
            <>
              {user ? (
                <>
                  <Link to="/dashboard" className="py-2 px-3 text-base font-medium rounded-md hover:bg-secondary">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="py-2 px-3 text-base font-medium rounded-md hover:bg-secondary">
                    Profile
                  </Link>
                  <button 
                    onClick={logout}
                    className="py-2 px-3 text-base font-medium rounded-md hover:bg-secondary text-left flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="py-2 px-3 text-base font-medium rounded-md hover:bg-secondary"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="py-2 px-3 text-base font-medium rounded-md bg-primary text-primary-foreground"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={cn(
                  "py-2 px-3 text-base font-medium rounded-md transition-colors",
                  location.pathname === '/dashboard' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                )}
              >
                Dashboard
              </Link>
              <Link 
                to="/tasks" 
                className={cn(
                  "py-2 px-3 text-base font-medium rounded-md transition-colors",
                  location.pathname === '/tasks' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                )}
              >
                Tasks
              </Link>
              <Link 
                to="/projects" 
                className={cn(
                  "py-2 px-3 text-base font-medium rounded-md transition-colors",
                  location.pathname === '/projects' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                )}
              >
                Projects
              </Link>
              <Link 
                to="/profile" 
                className={cn(
                  "py-2 px-3 text-base font-medium rounded-md transition-colors",
                  location.pathname === '/profile' ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                )}
              >
                Profile
              </Link>
              <button 
                onClick={logout}
                className="py-2 px-3 text-base font-medium rounded-md hover:bg-secondary text-left flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
