
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
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
  Calendar,
  MessageSquare,
  Bell
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDistanceToNow } from 'date-fns';

const NavBar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, respondToInvitation } = useNotifications();
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
    { href: '/chat', label: 'Chat', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { href: '/upload', label: 'Deploy', icon: <Upload className="h-4 w-4 mr-2" /> }
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'invitation':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'task-assigned':
        return <FileText className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
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
                  {/* Notifications dropdown */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="end">
                      <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-medium">Notifications</h3>
                        {unreadCount > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={markAllAsRead}
                          >
                            Mark all as read
                          </Button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`p-3 border-b last:border-b-0 ${!notification.read ? 'bg-primary/5' : ''}`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={notification.sender?.avatar} />
                                  <AvatarFallback>{notification.sender?.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                  </p>
                                  
                                  {notification.type === 'invitation' && !notification.read && (
                                    <div className="flex gap-2 mt-2">
                                      <Button 
                                        size="sm" 
                                        variant="default" 
                                        className="h-7 px-2"
                                        onClick={() => respondToInvitation(notification.id, true)}
                                      >
                                        Accept
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="h-7 px-2"
                                        onClick={() => respondToInvitation(notification.id, false)}
                                      >
                                        Decline
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center ml-2"
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name ? user.name.charAt(0) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:block">{user.name || 'User'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
