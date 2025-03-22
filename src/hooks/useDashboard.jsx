
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { firestore } from '@/services/firebase';

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
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Try to fetch from Firestore
        const projectsData = await projectAPI.getProjects();
        
        if (projectsData && Array.isArray(projectsData) && projectsData.length > 0) {
          // Format dates correctly
          const formattedProjects = projectsData.map(project => ({
            ...project,
            dueDate: project.dueDate ? new Date(project.dueDate) : null
          }));
          setProjects(formattedProjects);
        } else {
          // If no projects in Firestore, create mock projects there
          console.log("No projects found, initializing with mock data");
          
          const createdProjects = [];
          for (const mockProject of mockProjects) {
            try {
              const newProject = await projectAPI.createProject({
                title: mockProject.title,
                description: mockProject.description,
                color: mockProject.color,
                dueDate: mockProject.dueDate,
                members: mockProject.members,
                tasksCount: mockProject.tasksCount
              });
              createdProjects.push(newProject);
            } catch (err) {
              console.error("Failed to create mock project:", err);
            }
          }
          
          if (createdProjects.length > 0) {
            setProjects(createdProjects);
          } else {
            setProjects(mockProjects);
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects');
        setProjects(mockProjects);
        
        toast({
          title: "Error Loading Projects",
          description: "Using mock data instead. " + err.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [user]);

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const createProject = async (newProject) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You need to be logged in to create projects",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // Add project to Firestore
      const projectToAdd = {
        title: newProject.title || newProject.name,
        description: newProject.description,
        color: newProject.color || 'blue',
        dueDate: newProject.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        members: newProject.members || [],
        files: [],
        commits: [],
        meetings: [],
        collaborators: [],
        tasksCount: { total: 0, completed: 0 }
      };

      const createdProject = await projectAPI.createProject(projectToAdd);
      
      // Update local state
      setProjects(prev => [createdProject, ...prev]);
      
      toast({
        title: "Project created",
        description: `${newProject.title || newProject.name} has been created successfully`,
      });
      
      return createdProject;
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to Create Project",
        description: error.message || "An error occurred",
        variant: "destructive"
      });
      return null;
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
