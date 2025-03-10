
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TaskCard from './TaskCard';

const RecentTasks = ({ tasks }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recent Tasks</h2>
      {tasks.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">No tasks available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentTasks;
