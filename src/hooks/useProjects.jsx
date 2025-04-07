
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load projects from localStorage if available
    const loadProjects = () => {
      setIsLoading(true);
      try {
        const savedProjects = localStorage.getItem('user_projects');
        
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          // Ensure the data is in the expected format
          if (Array.isArray(parsedProjects)) {
            setProjects(parsedProjects);
          } else {
            console.warn('Saved projects is not an array, using mock data');
            setProjects(mockProjects);
          }
        } else {
          setProjects(mockProjects);
        }
      } catch (e) {
        console.error('Failed to parse saved projects', e);
        setError(e.message);
        setProjects(mockProjects);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add a small delay to prevent flickering
    const timer = setTimeout(loadProjects, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const navigateToProject = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return {
    projects,
    isLoading,
    error,
    navigateToProject
  };
};

export default useProjects;
