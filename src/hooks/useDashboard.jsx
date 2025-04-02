
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/firebaseAPI';
import { listenToList } from '@/services/firebaseAPI';
import { useAuth } from '@/context/AuthContext';

// Mock projects as fallback in case Firebase fails
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

const useDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects from Firebase
  useEffect(() => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Set up real-time listener for projects
      const unsubscribe = listenToList('projects', 'owner', user.id, (data) => {
        const formattedProjects = data.map(project => ({
          ...project,
          dueDate: project.dueDate ? new Date(project.dueDate) : new Date(),
          members: project.members || [],
          tasksCount: project.tasksCount || { total: 0, completed: 0 }
        }));
        
        setProjects(formattedProjects);
        setIsLoading(false);
        
        // Also save to localStorage as backup
        localStorage.setItem('user_projects', JSON.stringify(formattedProjects));
      });
      
      // Return cleanup function
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      
      // Try to load from localStorage if Firebase fails
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          setProjects(parsedProjects);
        } catch (e) {
          console.error('Failed to parse saved projects', e);
          setProjects(mockProjects);
        }
      } else {
        setProjects(mockProjects);
      }
      
      setIsLoading(false);
    }
  }, [user]);

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const createProject = async (newProject) => {
    try {
      // Convert date objects to ISO strings for Firebase
      const projectToAdd = {
        title: newProject.title,
        description: newProject.description,
        color: newProject.color || 'blue',
        dueDate: newProject.dueDate ? newProject.dueDate.toISOString() : new Date().toISOString(),
        members: newProject.members || [],
        files: [],
        commits: [],
        meetings: [],
        collaborators: [],
        tasksCount: { total: 0, completed: 0 }
      };
      
      const createdProject = await projectAPI.createProject(projectToAdd);
      
      toast({
        title: "Project created",
        description: `${newProject.title} has been created successfully`,
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
    createProject
  };
};

export default useDashboard;
