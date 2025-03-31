
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, ListChecks, FolderKanban, 
  Calendar, Bell, Settings, LogOut, ChevronLeft 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { gsap } from 'gsap';

const sidebarLinks = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tasks', icon: ListChecks, label: 'Tasks' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
];

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate the content when the route changes
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-border h-screen transition-all duration-300 ease-in-out flex flex-col z-10",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between h-16">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="text-primary text-xl">●</span>
              <span className="font-semibold">ProjectHub</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="ml-auto"
          >
            <ChevronLeft 
              size={18} 
              className={cn(
                "transition-transform duration-300",
                collapsed && "rotate-180"
              )} 
            />
          </Button>
        </div>

        <nav className="flex-1 pt-4">
          <ul className="space-y-1 px-2">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 font-normal",
                    collapsed ? "px-2" : "px-3",
                    location.pathname === link.path 
                      ? "bg-primary/10 text-primary hover:bg-primary/15" 
                      : "text-muted-foreground"
                  )}
                  onClick={() => navigate(link.path)}
                >
                  <link.icon size={18} />
                  {!collapsed && <span>{link.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-3 font-normal text-muted-foreground",
              collapsed && "px-2"
            )}
            onClick={() => navigate('/settings')}
          >
            <Settings size={18} />
            {!collapsed && <span>Settings</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start gap-3 font-normal text-muted-foreground",
              collapsed && "px-2"
            )}
            onClick={logout}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-white">
          <h1 className="text-xl font-semibold">
            {sidebarLinks.find(link => link.path === location.pathname)?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">
                  {user.name[0]}
                </div>
              )}
              
              {/* Only show name on larger screens */}
              <span className="text-sm font-medium hidden md:block">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main 
          ref={contentRef} 
          className="flex-1 overflow-auto p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
