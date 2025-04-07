
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const StatsCards = ({ projectsCount, tasksCount, upcomingTasksCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>
            You have {projectsCount} active {projectsCount === 1 ? 'project' : 'projects'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{projectsCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Total tasks across all projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{tasksCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming</CardTitle>
          <CardDescription>
            Tasks due in the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{upcomingTasksCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
