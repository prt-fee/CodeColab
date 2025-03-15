
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Plus } from 'lucide-react';
import NavBar from '@/components/NavBar';
import ProjectsList from '@/components/dashboard/ProjectsList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useProjects from '@/hooks/useProjects';
import { toast } from '@/hooks/use-toast';

const Projects = () => {
  const { user } = useAuth();
  const {
    projects,
    isLoading,
    navigateToProject
  } = useProjects();

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      },
      files: [],
      meetings: [],
      commits: [],
      pullRequests: []
    };
    
    // Add to localStorage
    const savedProjects = localStorage.getItem('user_projects');
    let updatedProjects = [];
    
    if (savedProjects) {
      try {
        updatedProjects = JSON.parse(savedProjects);
        updatedProjects.push(newProjectData);
      } catch (e) {
        updatedProjects = [newProjectData];
      }
    } else {
      updatedProjects = [newProjectData];
    }
    
    localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Success",
      description: "Project created successfully",
    });
    
    setNewProject({ name: '', description: '' });
    setIsDialogOpen(false);
    
    // Refresh page to show new project
    window.location.reload();
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
        />
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Add the details for your new project.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe your project"
                rows={4}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
