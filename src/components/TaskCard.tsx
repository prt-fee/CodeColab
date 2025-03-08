
import React from 'react';
import { format } from 'date-fns';
import { Task } from '@/hooks/useTaskManager';
import { 
  Clock, AlertCircle, CheckCircle, 
  ChevronRight, CalendarClock 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, className }) => {
  const priorityClasses = {
    low: 'text-green-500 bg-green-50',
    medium: 'text-amber-500 bg-amber-50',
    high: 'text-red-500 bg-red-50'
  };
  
  const statusIcons = {
    'todo': <Clock size={16} className="text-muted-foreground" />,
    'in-progress': <AlertCircle size={16} className="text-amber-500" />,
    'completed': <CheckCircle size={16} className="text-green-500" />
  };
  
  const isOverdue = task.dueDate && new Date() > task.dueDate && task.status !== 'completed';

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:border-primary/30",
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-base">{task.title}</h3>
        {statusIcons[task.status]}
      </div>
      
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <span 
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              priorityClasses[task.priority]
            )}
          >
            {task.priority}
          </span>
          
          {task.dueDate && (
            <span className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-500" : "text-muted-foreground"
            )}>
              <CalendarClock size={12} />
              {format(task.dueDate, 'MMM d')}
            </span>
          )}
        </div>
        
        <ChevronRight size={16} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default TaskCard;
