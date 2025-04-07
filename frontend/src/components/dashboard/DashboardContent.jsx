
import React, { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useTaskManager } from '@/hooks/useTaskManager';
import StatsCards from '@/components/dashboard/StatsCards';
import ProjectsList from '@/components/dashboard/ProjectsList';
import RecentTasks from '@/components/dashboard/RecentTasks';
import useDashboard from '@/hooks/useDashboard';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { staggerAnimation } from '@/lib/animations';

const DashboardContent = () => {
  const navigate = useNavigate();
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const contentRef = useRef(null);
  
  const {
    projects,
    isLoading,
    handleProjectClick,
    deleteProject,
    refreshProjects
  } = useDashboard();

  const { tasks, refreshTasks } = useTaskManager();

  // Refresh data when component mounts
  useEffect(() => {
    console.log("DashboardContent: Refreshing data");
    
    // Attempt to load data
    const loadData = async () => {
      try {
        await refreshProjects();
        if (refreshTasks) await refreshTasks();
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
      
      // Set a flag to avoid flickering on initial render
      setTimeout(() => {
        setIsContentLoaded(true);
      }, 300);
    };
    
    loadData();
  }, [refreshProjects, refreshTasks]);
  
  // Apply staggered animation to dashboard elements when content is loaded
  useEffect(() => {
    if (isContentLoaded && contentRef.current) {
      const elements = Array.from(contentRef.current.children);
      staggerAnimation(elements, 0.15, 0.4);
    }
  }, [isContentLoaded]);
  
  // Calculate upcoming tasks (due in the next 7 days)
  const upcomingTasksCount = Array.isArray(tasks) ? tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length : 0;

  if (isLoading || !isContentLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCreateNewProject = () => {
    // Navigate to projects page to create a new project
    navigate("/projects");
  };

  return (
    <div ref={contentRef} className="space-y-8">
      <StatsCards 
        projectsCount={Array.isArray(projects) ? projects.length : 0}
        tasksCount={Array.isArray(tasks) ? tasks.length : 0}
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
    </div>
  );
};

export default DashboardContent;
