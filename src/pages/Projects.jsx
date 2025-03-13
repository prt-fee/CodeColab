
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import NavBar from '@/components/NavBar';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsSearchBar from '@/components/projects/ProjectsSearchBar';
import ProjectsList from '@/components/dashboard/ProjectsList';
import NewProjectDialog from '@/components/dashboard/NewProjectDialog';
import { toast } from '@/hooks/use-toast';

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

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setIsLoading(false);
    }, 800);
    
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

  const filteredProjects = projects.filter(project => {
    return project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleProjectClick = (projectId) => {
    window.location.href = `/project/${projectId}`;
  };

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
        <ProjectsHeader />
        
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <ProjectsSearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
          
          <NewProjectDialog 
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            newProject={newProject}
            setNewProject={setNewProject}
            onCreateProject={handleCreateProject}
          />
        </div>
        
        <ProjectsList 
          projects={filteredProjects} 
          onCreateClick={() => setIsDialogOpen(true)} 
          onProjectClick={handleProjectClick}
        />
      </div>
    </div>
  );
};

export default Projects;
