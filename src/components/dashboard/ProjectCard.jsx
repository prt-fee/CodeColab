
import React from 'react';
import { Plus } from 'lucide-react';

const ProjectCard = ({ project, onClick }) => {
  const progress = project.tasksCount.total > 0 
    ? Math.round((project.tasksCount.completed / project.tasksCount.total) * 100) 
    : 0;

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  return (
    <div
      onClick={() => onClick(project.id)}
      className="bg-white rounded-lg border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30"
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className={`w-10 h-10 rounded-md flex items-center justify-center bg-${project.color ? project.color : 'primary'}-100 text-${project.color ? project.color : 'primary'}-500`}
        >
          <Plus size={20} />
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
          <span>{project.members} members</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span>{project.tasksCount.completed}/{project.tasksCount.total} tasks</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
