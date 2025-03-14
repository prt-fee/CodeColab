
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, ListTodo, Users, Calendar, Upload } from 'lucide-react';

const links = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Projects', path: '/projects', icon: <FolderKanban className="h-5 w-5" /> },
  { name: 'Tasks', path: '/tasks', icon: <ListTodo className="h-5 w-5" /> },
  { name: 'Kanban', path: '/kanban', icon: <FolderKanban className="h-5 w-5" /> },
  { name: 'Meetings', path: '/meetings', icon: <Calendar className="h-5 w-5" /> },
  { name: 'Upload', path: '/upload', icon: <Upload className="h-5 w-5" /> },
  { name: 'Team', path: '/team', icon: <Users className="h-5 w-5" /> },
];

const NavLinks = ({ isMobile = false }) => {
  return (
    <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'gap-6'}`}>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `flex items-center gap-2 ${isActive
              ? 'text-primary font-semibold'
              : 'text-muted-foreground hover:text-foreground transition-colors'
            } ${isMobile ? 'text-lg' : ''}`
          }
        >
          {link.icon}
          <span>{link.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default NavLinks;
