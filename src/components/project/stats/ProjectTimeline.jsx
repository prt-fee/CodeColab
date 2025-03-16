
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, differenceInDays, parseISO } from 'date-fns';
import { CalendarDays, CheckCircle, Clock } from 'lucide-react';

const ProjectTimeline = ({ project, tasks }) => {
  // Calculate project duration and progress
  const startDate = project.startDate ? new Date(project.startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const endDate = project.dueDate ? new Date(project.dueDate) : new Date(Date.now() + 23 * 24 * 60 * 60 * 1000);
  const totalDays = differenceInDays(endDate, startDate) || 30;
  const daysElapsed = differenceInDays(new Date(), startDate) || 7;
  const progressPercentage = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));
  
  // Find latest completed task
  let latestCompletedTask = { title: 'No tasks completed yet', completedAt: null };
  
  if (tasks && tasks.length > 0) {
    const completedTasks = tasks
      .filter(task => task.status === 'completed' && task.completedAt)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt);
        const dateB = new Date(b.completedAt);
        return dateB - dateA;
      });
      
    if (completedTasks.length > 0) {
      latestCompletedTask = completedTasks[0];
    }
  }
  
  // Find upcoming tasks (due soon)
  let upcomingTasks = [];
  
  if (tasks && tasks.length > 0) {
    upcomingTasks = tasks
      .filter(task => task.status !== 'completed' && task.dueDate)
      .sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA - dateB;
      })
      .slice(0, 3);
  }
  
  if (upcomingTasks.length === 0) {
    upcomingTasks = [
      { id: 'sample1', title: 'Set up project structure', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
      { id: 'sample2', title: 'Create UI mockups', dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }
    ];
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{format(startDate, 'MMM dd')}</span>
            <span>{format(endDate, 'MMM dd')}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm font-medium">{progressPercentage}% Complete</span>
            <p className="text-xs text-muted-foreground">
              {totalDays - daysElapsed} days remaining
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Latest Milestone
            </h4>
            <div className="bg-slate-100 p-3 rounded-md">
              <p className="font-medium">{latestCompletedTask.title}</p>
              {latestCompletedTask.completedAt && (
                <p className="text-xs text-muted-foreground">
                  Completed on {format(new Date(latestCompletedTask.completedAt), 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Upcoming Deadlines
            </h4>
            <div className="space-y-2">
              {upcomingTasks.map((task, index) => (
                <div key={task.id || index} className="bg-slate-100 p-3 rounded-md">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
