
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TaskItem = ({ task, onStatusChange }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(new Date(date));
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(task.id, newStatus);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Due: {formatDate(task.dueDate)}</span>
          <span className="capitalize">{task.status.replace('-', ' ')}</span>
        </div>

        <div className="flex gap-2 justify-end">
          {task.status !== 'todo' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('todo')}>
              Move to Todo
            </Button>
          )}
          {task.status !== 'in-progress' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('in-progress')}>
              Move to In Progress
            </Button>
          )}
          {task.status !== 'completed' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('completed')}>
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
