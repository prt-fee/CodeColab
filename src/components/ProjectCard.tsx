
import React from 'react';
import { FolderKanban, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Project {
  id: string;
  title: string;
  description?: string;
  color?: string;
  dueDate?: Date;
  members: number;
  tasksCount: {
    total: number;
    completed: number;
  };
}

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, className }) => {
  // Calculate project progress
  const progress = project.tasksCount.total > 0 
    ? Math.round((project.tasksCount.completed / project.tasksCount.total) * 100) 
    : 0;

  // Format the due date
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border shadow-sm p-5 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className={cn(
            "w-10 h-10 rounded-md flex items-center justify-center",
            project.color ? `bg-${project.color}-100 text-${project.color}-500` : "bg-primary/10 text-primary"
          )}
        >
          <FolderKanban size={20} />
        </div>
        <div>
          <h3 className="font-medium text-base">{project.title}</h3>
          {project.dueDate && (
            <p className="text-xs text-muted-foreground">
              Due {formatDate(project.dueDate)}
            </p>
          )}
        </div>
      </div>
      
      {project.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground">Progress</span>
          <span className="text-xs font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-muted-foreground text-xs">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{project.members}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>{project.tasksCount.completed}/{project.tasksCount.total} tasks</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
