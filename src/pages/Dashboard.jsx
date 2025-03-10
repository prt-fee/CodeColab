
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import { useTaskManager } from '@/hooks/useTaskManager';

// Import the new component files
import StatsCards from '@/components/dashboard/StatsCards';
import ProjectsList from '@/components/dashboard/ProjectsList';
import RecentTasks from '@/components/dashboard/RecentTasks';
import NewProjectDialog from '@/components/dashboard/NewProjectDialog';

const mockProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and feel',
    color: 'blue',
    dueDate: new Date('2023-06-30'),
    members: 4,
    tasksCount: {
      total: 12,
      completed: 8
    }
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    color: 'green',
    dueDate: new Date('2023-08-15'),
    members: 6,
    tasksCount: {
      total: 20,
      completed: 5
    }
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Plan and execute Q3 marketing campaign',
    color: 'orange',
    dueDate: new Date('2023-07-10'),
    members: 3,
    tasksCount: {
      total: 8,
      completed: 2
    }
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { tasks } = useTaskManager();

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCreateProject = (e) => {
    e.preventDefault();
    
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newProjectData = {
      id: Date.now().toString(),
      title: newProject.name,
      description: newProject.description,
      color: 'blue',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      members: 1,
      tasksCount: {
        total: 0,
        completed: 0
      }
    };
    
    setProjects([...projects, newProjectData]);
    
    toast({
      title: "Success",
      description: "Project created successfully",
    });
    
    setNewProject({ name: '', description: '' });
    setIsDialogOpen(false);
  };

  // Calculate upcoming tasks (due in the next 7 days)
  const upcomingTasksCount = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return dueDate >= today && dueDate <= nextWeek;
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}!
          </p>
        </header>
        
        <StatsCards 
          projectsCount={projects.length}
          tasksCount={tasks.length}
          upcomingTasksCount={upcomingTasksCount}
        />
        
        <ProjectsList 
          projects={projects}
          onCreateClick={() => setIsDialogOpen(true)}
        />
        
        <RecentTasks tasks={tasks} />
        
        <NewProjectDialog 
          isOpen={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          newProject={newProject}
          setNewProject={setNewProject}
          onCreateProject={handleCreateProject}
        />
      </div>
    </div>
  );
};

export default Dashboard;
