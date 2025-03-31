
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/api';

// Import mock projects as fallback
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
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects from API or localStorage
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API first (will work when backend is connected)
        const data = await projectAPI.getProjects().catch(() => null);
        
        if (data && Array.isArray(data)) {
          setProjects(data);
          // Also save to localStorage as backup
          localStorage.setItem('user_projects', JSON.stringify(data));
        } else {
          // If API fails, try localStorage
          const savedProjects = localStorage.getItem('user_projects');
          
          if (savedProjects) {
            try {
              const parsedProjects = JSON.parse(savedProjects);
              // Ensure the data is in the expected format
              if (Array.isArray(parsedProjects)) {
                setProjects(parsedProjects);
              } else {
                console.warn('Saved projects is not an array, using mock data');
                setProjects(mockProjects);
                localStorage.setItem('user_projects', JSON.stringify(mockProjects));
              }
            } catch (e) {
              console.error('Failed to parse saved projects', e);
              setProjects(mockProjects);
              localStorage.setItem('user_projects', JSON.stringify(mockProjects));
            }
          } else {
            setProjects(mockProjects);
            localStorage.setItem('user_projects', JSON.stringify(mockProjects));
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setProjects(mockProjects);
        localStorage.setItem('user_projects', JSON.stringify(mockProjects));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    if (projects.length > 0 && !isLoading) {
      localStorage.setItem('user_projects', JSON.stringify(projects));
    }
  }, [projects, isLoading]);

  const handleProjectClick = (projectId) => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is missing",
        variant: "destructive"
      });
      return;
    }
    
    // Use the navigate function to properly navigate to the project detail page
    navigate(`/projects/${projectId}`);
  };

  const createProject = (newProject) => {
    // Add unique ID and default values
    const projectToAdd = {
      id: Math.random().toString(36).substr(2, 9),
      ...newProject,
      createdAt: new Date().toISOString(),
      members: newProject.members || [],
      files: [],
      commits: [],
      meetings: [],
      collaborators: [],
      tasksCount: { total: 0, completed: 0 }
    };

    setProjects(prev => [projectToAdd, ...prev]);
    
    toast({
      title: "Project created",
      description: `${newProject.title} has been created successfully`,
    });
    
    return projectToAdd;
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
