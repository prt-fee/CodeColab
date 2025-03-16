
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TaskCompletionStats from './stats/TaskCompletionStats';
import TeamActivityStats from './stats/TeamActivityStats';
import CommitActivityStats from './stats/CommitActivityStats';
import ProjectTimeline from './stats/ProjectTimeline';

const StatsPanel = ({ project, projectTasks }) => {
  // Fallback data if projects or tasks are undefined
  const safeProject = project || { commits: [], members: [] };
  const safeTasks = projectTasks || [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TaskCompletionStats tasks={safeTasks} />
      <TeamActivityStats members={safeProject.members} />
      <CommitActivityStats commits={safeProject.commits} />
      <ProjectTimeline project={safeProject} tasks={safeTasks} />
    </div>
  );
};

export default StatsPanel;
