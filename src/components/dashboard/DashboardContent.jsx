
// import React from 'react';
// import { Loader2 } from 'lucide-react';
// import { useTaskManager } from '@/hooks/useTaskManager';
// import StatsCards from '@/components/dashboard/StatsCards';
// import ProjectsList from '@/components/dashboard/ProjectsList';
// import RecentTasks from '@/components/dashboard/RecentTasks';
// import useDashboard from '@/hooks/useDashboard';

// const DashboardContent = () => {
//   const {
//     projects,
//     isLoading,
//     handleProjectClick
//   } = useDashboard();

//   const { tasks } = useTaskManager();

//   // Calculate upcoming tasks (due in the next 7 days)
//   const upcomingTasksCount = tasks.filter(task => {
//     if (!task.dueDate) return false;
//     const dueDate = new Date(task.dueDate);
//     const today = new Date();
//     const nextWeek = new Date();
//     nextWeek.setDate(today.getDate() + 7);
//     return dueDate >= today && dueDate <= nextWeek;
//   }).length;

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <>
//       <StatsCards 
//         projectsCount={projects.length}
//         tasksCount={tasks.length}
//         upcomingTasksCount={upcomingTasksCount}
//       />
      
//       <ProjectsList 
//         projects={projects}
//         onCreateClick={() => window.location.href = "/projects"}
//         onProjectClick={handleProjectClick}
//       />
      
//       <RecentTasks tasks={tasks} />
//     </>
//   );
// };

// export default DashboardContent;




import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useTaskManager } from '@/hooks/useTaskManager';
import StatsCards from '@/components/dashboard/StatsCards';
import ProjectsList from '@/components/dashboard/ProjectsList';
import RecentTasks from '@/components/dashboard/RecentTasks';
import useDashboard from '@/hooks/useDashboard';
import { toast } from '@/hooks/use-toast';

const DashboardContent = () => {
  const {
    projects,
    isLoading,
    handleProjectClick,
    deleteProject,
    createProject,
    refreshProjects
  } = useDashboard();

  const { tasks } = useTaskManager();

  // Refresh projects when component mounts
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);
  
  // Calculate upcoming tasks (due in the next 7 days)
  const upcomingTasksCount = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCreateNewProject = () => {
    // Redirect to projects page to create a new project
    window.location.href = "/projects";
  };

  return (
    <>
      <StatsCards 
        projectsCount={Array.isArray(projects) ? projects.length : 0}
        tasksCount={tasks.length}
        upcomingTasksCount={upcomingTasksCount}
      />
      
      <ProjectsList 
        projects={projects}
        onCreateClick={handleCreateNewProject}
        onProjectClick={handleProjectClick}
        onDeleteProject={(projectId) => {
          deleteProject(projectId);
          toast({
            title: "Project deleted",
            description: "Project has been removed successfully"
          });
        }}
      />
      
      <RecentTasks tasks={tasks} />
    </>
  );
};

export default DashboardContent;