
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TaskStatusChart = ({ statusCounts, totalTasks }) => {
  return (
    <div className="h-64 flex items-center justify-center">
      {totalTasks > 0 ? (
        <div className="w-full h-full">
          <div className="flex justify-around h-full items-end">
            <div className="flex flex-col items-center">
              <div 
                className="bg-blue-500 w-16 rounded-t-md" 
                style={{ height: `${(statusCounts.todo / Math.max(totalTasks, 1)) * 200}px` }}
              ></div>
              <span className="mt-2 text-sm">Todo ({statusCounts.todo})</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="bg-yellow-500 w-16 rounded-t-md" 
                style={{ height: `${(statusCounts.inProgress / Math.max(totalTasks, 1)) * 200}px` }}
              ></div>
              <span className="mt-2 text-sm">In Progress ({statusCounts.inProgress})</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="bg-green-500 w-16 rounded-t-md" 
                style={{ height: `${(statusCounts.completed / Math.max(totalTasks, 1)) * 200}px` }}
              ></div>
              <span className="mt-2 text-sm">Completed ({statusCounts.completed})</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No task data available</p>
      )}
    </div>
  );
};

const TaskPriorityChart = ({ priorityCounts, totalTasks }) => {
  return (
    <div className="h-64 flex items-center justify-center">
      {totalTasks > 0 ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Low priority slice */}
              <circle 
                r="25" cx="50" cy="50" 
                fill="transparent"
                stroke="rgb(59, 130, 246)" 
                strokeWidth="50" 
                strokeDasharray={`${(priorityCounts.low / Math.max(totalTasks, 1)) * 157} 157`} 
                transform="rotate(-90) translate(-100, 0)" 
              />
              {/* Medium priority slice */}
              <circle 
                r="25" cx="50" cy="50" 
                fill="transparent"
                stroke="rgb(234, 179, 8)" 
                strokeWidth="50" 
                strokeDasharray={`${(priorityCounts.medium / Math.max(totalTasks, 1)) * 157} 157`} 
                strokeDashoffset={`${-1 * (priorityCounts.low / Math.max(totalTasks, 1)) * 157}`}
                transform="rotate(-90) translate(-100, 0)" 
              />
              {/* High priority slice */}
              <circle 
                r="25" cx="50" cy="50" 
                fill="transparent"
                stroke="rgb(239, 68, 68)" 
                strokeWidth="50" 
                strokeDasharray={`${(priorityCounts.high / Math.max(totalTasks, 1)) * 157} 157`} 
                strokeDashoffset={`${-1 * ((priorityCounts.low + priorityCounts.medium) / Math.max(totalTasks, 1)) * 157}`}
                transform="rotate(-90) translate(-100, 0)" 
              />
            </svg>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground">No priority data available</p>
      )}
    </div>
  );
};

const ProjectProgressBar = ({ project }) => {
  const progressPercentage = project.tasksCount.total > 0 
    ? Math.round((project.tasksCount.completed / project.tasksCount.total) * 100) 
    : 0;
    
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">Overall Progress</span>
        <span className="text-sm font-medium">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const StatsPanel = ({ project, projectTasks }) => {
  // Calculate task status counts for charts
  const statusCounts = {
    todo: projectTasks.filter(task => task.status === 'todo').length,
    inProgress: projectTasks.filter(task => task.status === 'in-progress').length,
    completed: projectTasks.filter(task => task.status === 'completed').length
  };

  // Calculate priority counts for charts
  const priorityCounts = {
    low: projectTasks.filter(task => task.priority === 'low').length,
    medium: projectTasks.filter(task => task.priority === 'medium').length,
    high: projectTasks.filter(task => task.priority === 'high').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusChart 
              statusCounts={statusCounts} 
              totalTasks={projectTasks.length} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskPriorityChart 
              priorityCounts={priorityCounts} 
              totalTasks={projectTasks.length} 
            />
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm">Low ({priorityCounts.low})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-sm">Medium ({priorityCounts.medium})</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">High ({priorityCounts.high})</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectProgressBar project={project} />
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>Started: {new Date(new Date().setDate(new Date().getDate() - 14)).toLocaleDateString()}</div>
              <div>Due: {project.dueDate.toLocaleDateString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsPanel;
