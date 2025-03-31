
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Initial mock projects data
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

const useProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load projects from localStorage if available
    const savedProjects = localStorage.getItem('user_projects');
    
    const timer = setTimeout(() => {
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects);
          // Ensure the data is in the expected format
          if (Array.isArray(parsedProjects)) {
            setProjects(parsedProjects);
          } else {
            console.warn('Saved projects is not an array, using mock data');
            setProjects(mockProjects);
          }
        } catch (e) {
          console.error('Failed to parse saved projects', e);
          setProjects(mockProjects);
        }
      } else {
        setProjects(mockProjects);
        // Initialize localStorage with mock data
        localStorage.setItem('user_projects', JSON.stringify(mockProjects));
      }
      setIsLoading(false);
    }, 500); // Reduced the loading time for better user experience
    
    return () => clearTimeout(timer);
  }, []);

  const navigateToProject = (projectId) => {
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

  return {
    projects,
    isLoading,
    navigateToProject
  };
};

export default useProjects;
