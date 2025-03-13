
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Mock projects data
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
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Save projects to localStorage when they change
  useEffect(() => {
    if (projects.length > 0 && !isLoading) {
      localStorage.setItem('user_projects', JSON.stringify(projects));
    }
  }, [projects, isLoading]);

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
    
    const updatedProjects = [...projects, newProjectData];
    setProjects(updatedProjects);
    localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Success",
      description: "Project created successfully",
    });
    
    setNewProject({ name: '', description: '' });
    setIsDialogOpen(false);
    
    // Navigate to the new project
    navigate(`/project/${newProjectData.id}`);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  return {
    projects,
    isLoading,
    newProject,
    setNewProject,
    isDialogOpen,
    setIsDialogOpen,
    handleCreateProject,
    handleProjectClick
  };
};

export default useDashboard;
