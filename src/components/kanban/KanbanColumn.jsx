
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import KanbanTaskCard from './KanbanTaskCard';

const KanbanColumn = ({ title, tasks, status, onDragStart, onDrop }) => {
  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(status);
  };

  return (
    <div 
      className="flex flex-col h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {title}
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
