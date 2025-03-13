
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, ArrowUpCircle, Circle, CheckCircle2 } from 'lucide-react';
import KanbanTaskCard from './KanbanTaskCard';

const KanbanColumn = ({ title, tasks, status, onDragStart, onDragEnd, onDrop }) => {
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    // Add visual feedback for drag over
    e.currentTarget.classList.add('bg-accent/50');
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-accent/50');
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-accent/50');
    onDrop(status);
  };

  // Get the appropriate icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4 text-blue-500" />;
      case 'in-progress':
        return <ArrowUpCircle className="h-4 w-4 text-amber-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  // Get border color based on status
  const getBorderColor = () => {
    switch (status) {
      case 'todo':
        return 'border-t-4 border-t-blue-500';
      case 'in-progress':
        return 'border-t-4 border-t-amber-500';
      case 'completed':
        return 'border-t-4 border-t-green-500';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`flex flex-col h-full transition-colors duration-200 rounded-lg ${getBorderColor()}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card className="h-full flex flex-col shadow-sm border-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center">
              {getStatusIcon()}
              <span className="ml-2">{title}</span>
            </CardTitle>
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto pt-0">
          <div className="space-y-3 min-h-[50vh]">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <KanbanTaskCard 
                  key={task.id} 
                  task={task} 
                  onDragStart={() => onDragStart(task)}
                  onDragEnd={onDragEnd}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-24 border border-dashed rounded-md text-muted-foreground">
                No tasks
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KanbanColumn;
