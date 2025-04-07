import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Plus } from 'lucide-react';
import NavBar from '@/components/NavBar';
import ProjectsList from '@/components/dashboard/ProjectsList';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import NewProjectDialog from '@/components/dashboard/NewProjectDialog';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { database, auth } from '@/services/firebase';
import { ref, onValue, set } from 'firebase/database';

const Projects = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setContentReady(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      toast({
        title: "Authentication required",
        description: "Please log in to view projects",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadProjects = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    
    try {
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          if (Array.isArray(parsedProjects)) {
            setProjects(parsedProjects);
          }
        } catch (err) {
          console.error("Error parsing projects from localStorage:", err);
        }
      }
      
      if (auth.currentUser) {
        const projectsRef = ref(database, 'projects');
        onValue(projectsRef, (snapshot) => {
          if (snapshot.exists()) {
            const fbProjects = [];
            snapshot.forEach((child) => {
              const project = child.val();
              if (project && project.id && (project.owner === user.id)) {
                fbProjects.push(project);
              }
            });
            
            if (fbProjects.length > 0) {
              console.log("Loaded projects from Firebase:", fbProjects.length);
              setProjects(fbProjects);
              localStorage.setItem('user_projects', JSON.stringify(fbProjects));
            } else if (!savedProjects) {
              const mockData = [
                {
                  id: '1',
                  title: 'Website Redesign',
                  description: 'Redesign the company website with a modern look and feel',
                  color: 'blue',
                  dueDate: new Date('2023-06-30').toISOString(),
                  members: 4,
                  tasksCount: { total: 12, completed: 8 },
                  owner: user.id
                },
                {
                  id: '2',
                  title: 'Mobile App Development',
                  description: 'Create a new mobile app for customer engagement',
                  color: 'green',
                  dueDate: new Date('2023-08-15').toISOString(),
                  members: 6,
                  tasksCount: { total: 20, completed: 5 },
                  owner: user.id
                },
                {
                  id: '3',
                  title: 'Marketing Campaign',
                  description: 'Plan and execute Q3 marketing campaign',
                  color: 'orange',
                  dueDate: new Date('2023-07-10').toISOString(),
                  members: 3,
                  tasksCount: { total: 8, completed: 2 },
                  owner: user.id
                }
              ];
              
              setProjects(mockData);
              localStorage.setItem('user_projects', JSON.stringify(mockData));
            }
          } else if (!savedProjects) {
            setProjects([]);
          }
        }, (error) => {
          console.error("Error loading projects from Firebase:", error);
        });
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const filteredProjects = projects.filter(project => 
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToProject = (projectId) => {
    if (projectId) {
      navigate(`/projects/${projectId}`);
    }
  };

  const deleteProject = (projectId) => {
    if (!projectId) return;
    
    try {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
      
      if (auth.currentUser) {
        const projectRef = ref(database, `projects/${projectId}`);
        set(projectRef, null)
          .catch((error) => {
            console.error("Error deleting from Firebase:", error);
          });
      }
      
      toast({
        title: "Project deleted",
        description: "Project has been removed successfully"
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    }
  };

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
      const projectId = Date.now().toString();
      
      const newProjectData = {
        id: projectId,
        title: newProject.name,
        description: newProject.description,
        color: 'blue',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        members: [],
        tasksCount: {
          total: 0,
          completed: 0
        },
        createdAt: new Date().toISOString(),
        owner: user?.id || 'anonymous'
      };
      
      const updatedProjects = [...projects, newProjectData];
      setProjects(updatedProjects);
      
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
      
      if (auth.currentUser) {
        const projectsRef = ref(database, `projects/${projectId}`);
        await set(projectsRef, newProjectData);
      }
      
      toast({
        title: "Success",
        description: "Project created successfully",
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
      
      navigateToProject(projectId);
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    }
  };

  if (authLoading || loading || !contentReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
        
        {filteredProjects.length > 0 ? (
          <ProjectsList 
            projects={filteredProjects} 
            onCreateClick={() => setIsDialogOpen(true)} 
            onProjectClick={navigateToProject}
            onDeleteProject={deleteProject}
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground mb-4">No projects found</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first project
            </Button>
          </div>
        )}
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
