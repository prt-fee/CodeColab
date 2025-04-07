
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// Types
export interface TaskCount {
  total: number;
  completed: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  color: string;
  dueDate: Date;
  members: number;
  tasksCount: TaskCount;
}

export interface NewProject {
  name: string;
  description: string;
}

// Initial mock projects data
const mockProjects: Project[] = [
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newProject, setNewProject] = useState<NewProject>({
    name: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // Load projects on initial render
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulate API call
        const timer = setTimeout(() => {
          // Check if projects exist in local storage
          const storedProjects = localStorage.getItem('projectify_projects');
          if (storedProjects) {
            // Parse the stored projects and convert date strings back to Date objects
            const parsedProjects = JSON.parse(storedProjects, (key, value) => {
              if (key === 'dueDate') {
                return value ? new Date(value) : null;
              }
              return value;
            });
            setProjects(parsedProjects);
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
  const createProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newProjectData: Project = {
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
  const navigateToProject = (projectId: string) => {
    window.location.href = `/projects/${projectId}`;
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
