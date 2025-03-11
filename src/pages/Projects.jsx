
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import ProjectsHeader from '@/components/projects/ProjectsHeader';
import ProjectsSearchBar from '@/components/projects/ProjectsSearchBar';
import ProjectsList from '@/components/dashboard/ProjectsList';
import NewProjectDialog from '@/components/dashboard/NewProjectDialog';
import useProjects from '@/hooks/useProjects';

const Projects = () => {
  const { user } = useAuth();
  const {
    projects,
    isLoading,
    searchTerm,
    setSearchTerm,
    newProject,
    setNewProject,
    isDialogOpen,
    setIsDialogOpen,
    createProject,
    navigateToProject
  } = useProjects();

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
            onCreateProject={createProject}
          />
        </div>
        
        <ProjectsList 
          projects={projects} 
          onCreateClick={() => setIsDialogOpen(true)} 
          onProjectClick={navigateToProject}
        />
      </div>
    </div>
  );
};

export default Projects;
