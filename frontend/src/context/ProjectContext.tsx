import { createContext, useContext, useState, useEffect } from 'react';
import { projectAPI } from '../services/firebaseAPI';
import { toast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: string[];
  tasks: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  getProjects: () => Promise<void>;
  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all projects
  const getProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await projectAPI.getProjects();
      if (data) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new project
  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const newProject = await projectAPI.createProject({
        ...projectData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [projectData.owner]
      });

      if (newProject) {
        setProjects(prev => [...prev, newProject]);
        toast({
          title: "Project created",
          description: `${projectData.name} has been created successfully`
        });
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Failed to create project');
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing project
  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedProject = await projectAPI.updateProject(projectId, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      if (updatedProject) {
        setProjects(prev => 
          prev.map(project => 
            project.id === projectId ? updatedProject : project
          )
        );
        toast({
          title: "Project updated",
          description: "Project details have been updated"
        });
      }
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project');
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await projectAPI.deleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      toast({
        title: "Project deleted",
        description: "Project has been deleted successfully"
      });
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project');
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize projects when component mounts
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <ProjectContext.Provider 
      value={{ 
        projects, 
        isLoading, 
        error,
        getProjects,
        createProject,
        updateProject,
        deleteProject 
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
