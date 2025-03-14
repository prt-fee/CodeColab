
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TaskItem from './TaskItem';

const TaskColumn = ({ title, tasks, onStatusChange }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} />
        ))}
        {tasks.length === 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 text-center text-muted-foreground">
              No {title.toLowerCase()} tasks found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
