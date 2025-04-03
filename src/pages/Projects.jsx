
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Plus } from 'lucide-react';
import NavBar from '@/components/NavBar';
import ProjectsList from '@/components/dashboard/ProjectsList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NewProjectDialog from '@/components/dashboard/NewProjectDialog';
import { toast } from '@/hooks/use-toast';
import useDashboard from '@/hooks/useDashboard';

const Projects = () => {
  const { user } = useAuth();
  const {
    projects,
    isLoading,
    handleProjectClick: navigateToProject,
    deleteProject,
    createProject,
    refreshProjects
  } = useDashboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    assignees: [],
    manager: null,
    startDate: null,
    endDate: null,
    category: 'uncategorized',
    status: 'active'
  });

  // Refresh projects when component mounts
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // Filter projects based on search term
  const filteredProjects = Array.isArray(projects) ? projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createProject({
        title: newProject.name,
        description: newProject.description,
        dueDate: newProject.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      setNewProject({
        name: '',
        description: '',
        assignees: [],
        manager: null,
        startDate: null,
        endDate: null,
        category: 'uncategorized',
        status: 'active'
      });
      setIsDialogOpen(false);
      
      // Refresh projects list
      refreshProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    }
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your projects in one place
          </p>
        </header>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="relative w-full md:w-1/3">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
        
        <ProjectsList 
          projects={filteredProjects} 
          onCreateClick={() => setIsDialogOpen(true)} 
          onProjectClick={navigateToProject}
          onDeleteProject={deleteProject}
        />
      </div>
      
      <NewProjectDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        newProject={newProject}
        setNewProject={setNewProject}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default Projects;
