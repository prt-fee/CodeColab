
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/firebaseAPI';
import { listenToList } from '@/services/firebaseAPI';
import { useAuth } from '@/context/AuthContext';
import useLocalStorage from '@/hooks/useLocalStorage';

// Mock projects as fallback in case Firebase fails
const mockProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and feel',
    color: 'blue',
    dueDate: new Date('2023-06-30'),
    members: [],
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
    members: [],
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
    members: [],
    tasksCount: {
      total: 8,
      completed: 2
    }
  }
];

// Utility function to normalize project data
const normalizeProject = (project) => {
  // Ensure members is an array
  const members = Array.isArray(project.members) ? project.members : [];
  
  return {
    ...project,
    id: project.id || `temp-${Date.now()}`,
    title: project.title || project.name || 'Untitled Project',
    description: project.description || '',
    color: project.color || 'blue',
    dueDate: project.dueDate ? new Date(project.dueDate) : new Date(),
    // Ensure members is always an array
    members: members,
    // Ensure tasksCount exists with proper structure
    tasksCount: project.tasksCount || { total: 0, completed: 0 },
    // Ensure other required arrays exist
    files: Array.isArray(project.files) ? project.files : [],
    commits: Array.isArray(project.commits) ? project.commits : [],
    meetings: Array.isArray(project.meetings) ? project.meetings : [],
    collaborators: Array.isArray(project.collaborators) ? project.collaborators : []
  };
};

const useDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { saveProjects, getProjects } = useLocalStorage();

  // Function to refresh projects - separate from effect to be callable
  const refreshProjects = useCallback(() => {
    if (!user) {
      console.log("No user found, cannot load projects");
      setProjects([]);
      setIsLoading(false);
      return () => {};
    }
    
    setIsLoading(true);
    console.log("Loading dashboard projects for user:", user.id);
    
    // First, load from localStorage for immediate UI feedback
    const storedProjects = getProjects();
    if (storedProjects && storedProjects.length > 0) {
      console.log("Loaded projects from localStorage:", storedProjects.length);
      const normalizedProjects = storedProjects.map(project => normalizeProject(project));
      setProjects(normalizedProjects);
    }
    
    try {
      // Set up real-time listener for projects
      const unsubscribe = listenToList('projects', 'owner', user.id, (data) => {
        console.log("Received projects data from Firebase:", data?.length || 0);
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Normalize each project to ensure consistent structure
          const formattedProjects = data.map(project => normalizeProject(project));
          
          setProjects(formattedProjects);
          
          // Also save to localStorage as backup
          saveProjects(formattedProjects);
        } else if (data && Array.isArray(data) && data.length === 0) {
          // No projects found in Firebase, but we still need to update state
          console.log("No projects found in Firebase");
          
          // If we don't have localStorage projects, set empty array
          if (!storedProjects || storedProjects.length === 0) {
            setProjects([]);
          }
        }
        
        setIsLoading(false);
      }, (error) => {
        console.error('Error in Firebase listener:', error);
        handleFirebaseError(storedProjects);
      });
      
      // Return cleanup function
      return unsubscribe;
    } catch (err) {
      console.error('Error setting up projects listener:', err);
      handleFirebaseError(storedProjects);
      return () => {};
    }
  }, [user, getProjects, saveProjects]);

  // Load projects from Firebase
  useEffect(() => {
    const unsubscribe = refreshProjects();
    
    // Cleanup on unmount
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [refreshProjects]);

  const handleFirebaseError = (storedProjects) => {
    setError('Failed to load projects from Firebase');
    console.error("Firebase error encountered, falling back to localStorage data");
    
    // Use localStorage data if available
    if (storedProjects && storedProjects.length > 0) {
      // Normalize projects from localStorage
      const normalizedProjects = storedProjects.map(project => normalizeProject(project));
      setProjects(normalizedProjects);
      console.log("Using localStorage projects as fallback:", normalizedProjects.length);
    } else {
      // Use mock data as a last resort
      console.log("No localStorage data, using mock projects");
      const normalizedMockProjects = mockProjects.map(project => normalizeProject(project));
      setProjects(normalizedMockProjects);
      saveProjects(normalizedMockProjects);
    }
    
    setIsLoading(false);
  };

  const handleProjectClick = (projectId) => {
    if (!projectId) {
      console.error("Invalid project ID");
      return;
    }
    navigate(`/projects/${projectId}`);
  };

  const deleteProject = async (projectId) => {
    try {
      if (!projectId) {
        toast({
          title: "Error",
          description: "Project ID is required",
          variant: "destructive"
        });
        return;
      }

      // Optimistically update UI
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      
      // Save to localStorage as backup
      saveProjects(updatedProjects);

      // Delete from Firebase if available
      if (projectAPI && projectAPI.deleteProject) {
        await projectAPI.deleteProject(projectId);
        console.log("Project deleted from Firebase:", projectId);
      }
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted"
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      });
      
      // Refresh projects to restore state
      refreshProjects();
    }
  };

  const createProject = async (newProject) => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a project",
          variant: "destructive"
        });
        return null;
      }
      
      // Create a properly structured project
      const projectToAdd = normalizeProject({
        title: newProject.title || newProject.name,
        description: newProject.description,
        color: newProject.color || 'blue',
        dueDate: newProject.dueDate ? newProject.dueDate : new Date()
      });
      
      // Convert date objects to ISO strings for Firebase
      const firebaseProject = {
        ...projectToAdd,
        dueDate: projectToAdd.dueDate.toISOString(),
        owner: user?.id,
        createdAt: new Date().toISOString()
      };
      
      let createdProject;
      
      // Try to create in Firebase
      if (projectAPI && projectAPI.createProject) {
        try {
          console.log("Creating project in Firebase:", firebaseProject);
          createdProject = await projectAPI.createProject(firebaseProject);
          console.log("Project created in Firebase:", createdProject);
          
          // Optimistically update UI
          const updatedProjects = [...projects, normalizeProject(createdProject)];
          setProjects(updatedProjects);
          
          // Save to localStorage
          saveProjects(updatedProjects);
        } catch (firebaseError) {
          console.error("Firebase create failed, creating locally:", firebaseError);
          
          // Create locally if Firebase fails
          createdProject = {
            ...firebaseProject,
            id: `local-${Date.now()}`
          };
          
          // Add to local state immediately
          const updatedProjects = [...projects, createdProject];
          setProjects(updatedProjects);
          
          // Save to localStorage
          saveProjects(updatedProjects);
        }
      } else {
        // Create locally if Firebase isn't available
        createdProject = {
          ...firebaseProject,
          id: `local-${Date.now()}`
        };
        
        // Add to local state immediately
        const updatedProjects = [...projects, createdProject];
        setProjects(updatedProjects);
        
        // Save to localStorage
        saveProjects(updatedProjects);
        console.log("Project created locally:", createdProject);
      }
      
      toast({
        title: "Project created",
        description: `${newProject.title || newProject.name} has been created successfully`,
      });
      
      return createdProject;
    } catch (error) {
      console.error('Error creating project:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
      
      throw error;
    }
  };

  return {
    projects,
    isLoading,
    error,
    handleProjectClick,
    createProject,
    deleteProject,
    refreshProjects
  };
};

export default useDashboard;
