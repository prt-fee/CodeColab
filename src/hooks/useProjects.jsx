
import { useState, useEffect } from 'react';
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
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load projects on initial render
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulate API call
        const timer = setTimeout(() => {
          // Check if projects exist in local storage
          const storedProjects = localStorage.getItem('projectify_projects');
          if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
          } else {
            setProjects(mockProjects);
            // Store mock projects in localStorage
            localStorage.setItem('projectify_projects', JSON.stringify(mockProjects));
          }
          setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => {
    return project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Create a new project
  const createProject = (e) => {
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
      }
    };
    
    const updatedProjects = [...projects, newProjectData];
    setProjects(updatedProjects);
    
    // Update localStorage
    localStorage.setItem('projectify_projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Success",
      description: "Project created successfully",
    });
    
    setNewProject({ name: '', description: '' });
    setIsDialogOpen(false);
  };

  // Navigate to project detail
  const navigateToProject = (projectId) => {
    window.location.href = `/project/${projectId}`;
  };

  return {
    projects: filteredProjects,
    isLoading,
    searchTerm,
    setSearchTerm,
    newProject,
    setNewProject,
    isDialogOpen,
    setIsDialogOpen,
    createProject,
    navigateToProject
  };
};

export default useProjects;
