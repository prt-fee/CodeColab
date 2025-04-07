
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, User, Tag, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const KanbanTaskCard = ({ task, onDragStart, onDragEnd }) => {
  const priorityColors = {
    low: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      label: 'Low'
    },
    medium: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-800 dark:text-amber-300',
      label: 'Medium'
    },
    high: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      label: 'High'
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(new Date(date));
  };

  // Handle drag events
  const handleDragStart = (e) => {
    e.target.style.opacity = '0.4';
    onDragStart(e);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    if (onDragEnd) onDragEnd();
  };

  // Get border color based on task status
  const getCardStyles = () => {
    const priority = priorityColors[task.priority];
    return {
      borderLeft: `4px solid ${task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#3b82f6'}`,
    };
  };

  return (
    <Card 
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all transform hover:-translate-y-1 bg-card dark:bg-card/90"
      style={getCardStyles()}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm sm:text-base">{task.title}</h3>
          <Badge className={`${priorityColors[task.priority].bg} ${priorityColors[task.priority].text}`}>
            {priorityColors[task.priority].label}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground mt-3 gap-2">
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          {task.status === 'completed' && (
            <div className="flex items-center text-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanTaskCard;
