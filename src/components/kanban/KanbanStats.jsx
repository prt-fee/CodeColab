
import React from 'react';
import { Badge } from '@/components/ui/badge';

const KanbanStats = ({ todoTasks, inProgressTasks, completedTasks, completionRate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-sm">
        <h3 className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-wider">To Do</h3>
        <p className="text-2xl font-bold">{todoTasks.length}</p>
      </div>
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 shadow-sm">
        <h3 className="text-amber-600 dark:text-amber-400 font-medium text-sm uppercase tracking-wider">In Progress</h3>
        <p className="text-2xl font-bold">{inProgressTasks.length}</p>
      </div>
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow-sm">
        <h3 className="text-green-600 dark:text-green-400 font-medium text-sm uppercase tracking-wider">Completed</h3>
        <p className="text-2xl font-bold">{completedTasks.length}</p>
      </div>
    </div>
  );
};

export default KanbanStats;
