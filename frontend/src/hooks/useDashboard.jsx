
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from '@/hooks/use-toast';
// import { projectAPI } from '@/services/api';

// // Import mock projects as fallback
// const mockProjects = [
//   {
//     id: '1',
//     title: 'Website Redesign',
//     description: 'Redesign the company website with a modern look and feel',
//     color: 'blue',
//     dueDate: new Date('2023-06-30'),
//     members: 4,
//     tasksCount: {
//       total: 12,
//       completed: 8
//     }
//   },
//   {
//     id: '2',
//     title: 'Mobile App Development',
//     description: 'Create a new mobile app for customer engagement',
//     color: 'green',
//     dueDate: new Date('2023-08-15'),
//     members: 6,
//     tasksCount: {
//       total: 20,
//       completed: 5
//     }
//   },
//   {
//     id: '3',
//     title: 'Marketing Campaign',
//     description: 'Plan and execute Q3 marketing campaign',
//     color: 'orange',
//     dueDate: new Date('2023-07-10'),
//     members: 3,
//     tasksCount: {
//       total: 8,
//       completed: 2
//     }
//   }
// ];

// const useDashboard = () => {
//   const navigate = useNavigate();
//   const [projects, setProjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Load projects from API or localStorage
//   useEffect(() => {
//     const fetchProjects = async () => {
//       setIsLoading(true);
//       try {
//         // Try to fetch from API first (will work when backend is connected)
//         const data = await projectAPI.getProjects().catch(() => null);
        
//         if (data && Array.isArray(data)) {
//           setProjects(data);
//           // Also save to localStorage as backup
//           localStorage.setItem('user_projects', JSON.stringify(data));
//         } else {
//           // If API fails, try localStorage
//           const savedProjects = localStorage.getItem('user_projects');
          
//           if (savedProjects) {
//             try {
//               const parsedProjects = JSON.parse(savedProjects);
//               // Ensure the data is in the expected format
//               if (Array.isArray(parsedProjects)) {
//                 setProjects(parsedProjects);
//               } else {
//                 console.warn('Saved projects is not an array, using mock data');
//                 setProjects(mockProjects);
//               }
//             } catch (e) {
//               console.error('Failed to parse saved projects', e);
//               setProjects(mockProjects);
//             }
//           } else {
//             setProjects(mockProjects);
//           }
//         }
//       } catch (err) {
//         console.error('Error fetching projects:', err);
//         setError('Failed to load projects');
//         setProjects(mockProjects);
//       } finally {
//         setIsLoading(false);
//       }
//     };
    
//     fetchProjects();
//   }, []);

//   // Save projects to localStorage when they change
//   useEffect(() => {
//     if (projects.length > 0 && !isLoading) {
//       localStorage.setItem('user_projects', JSON.stringify(projects));
//     }
//   }, [projects, isLoading]);

//   const handleProjectClick = (projectId) => {
//     navigate(`/projects/${projectId}`);
//   };

//   const createProject = (newProject) => {
//     // Add unique ID and default values
//     const projectToAdd = {
//       id: Math.random().toString(36).substr(2, 9),
//       ...newProject,
//       createdAt: new Date().toISOString(),
//       members: newProject.members || [],
//       files: [],
//       commits: [],
//       meetings: [],
//       collaborators: [],
//       tasksCount: { total: 0, completed: 0 }
//     };

//     setProjects(prev => [projectToAdd, ...prev]);
    
//     toast({
//       title: "Project created",
//       description: `${newProject.title} has been created successfully`,
//     });
    
//     return projectToAdd;
//   };

//   return {
//     projects,
//     isLoading,
//     error,
//     handleProjectClick,
//     createProject
//   };
// };

// export default useDashboard;







import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/firebaseAPI';
import { listenToList } from '@/services/firebaseAPI';
import { useAuth } from '@/context/AuthContext';
import { debugFirebase } from '@/utils/debugFirebase';

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

  // Function to refresh projects - separate from effect to be callable
  const refreshProjects = useCallback(() => {
    if (!user) return;
    
    setIsLoading(true);
    console.log("Loading dashboard projects for user:", user.id);
    
    try {
      // Set up real-time listener for projects
      const unsubscribe = listenToList('projects', 'owner', user.id, (data) => {
        console.log("Received projects data:", data);
        
        // Normalize each project to ensure consistent structure
        const formattedProjects = data.map(project => normalizeProject(project));
        
        setProjects(formattedProjects);
        setIsLoading(false);
        
        // Also save to localStorage as backup
        localStorage.setItem('user_projects', JSON.stringify(formattedProjects));
      }, (error) => {
        console.error('Error in Firebase listener:', error);
        handleFirebaseError();
      });
      
      // Return cleanup function
      return unsubscribe;
    } catch (err) {
      console.error('Error fetching projects:', err);
      handleFirebaseError();
    }
  }, [user]);

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

  const handleFirebaseError = () => {
    setError('Failed to load projects from Firebase');
    
    // Run diagnostics
    debugFirebase().then(info => {
      console.log("Firebase diagnostics:", info);
    }).catch(err => {
      console.error("Failed to run Firebase diagnostics:", err);
    });
    
    // Try to load from localStorage if Firebase fails
    const savedProjects = localStorage.getItem('user_projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        // Normalize projects from localStorage
        const normalizedProjects = parsedProjects.map(project => normalizeProject(project));
        setProjects(normalizedProjects);
        console.log("Loaded projects from localStorage:", normalizedProjects);
      } catch (e) {
        console.error('Failed to parse saved projects', e);
        setProjects(mockProjects.map(project => normalizeProject(project)));
      }
    } else {
      setProjects(mockProjects.map(project => normalizeProject(project)));
      console.log("Using mock projects as fallback");
    }
    
    setIsLoading(false);
  };

  const handleProjectClick = (projectId) => {
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
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));

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
    }
  };

  const createProject = async (newProject) => {
    try {
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
        owner: user?.id || 'unknown',
        createdAt: new Date().toISOString()
      };
      
      let createdProject;
      
      // Try to create in Firebase
      if (projectAPI && projectAPI.createProject) {
        createdProject = await projectAPI.createProject(firebaseProject);
        console.log("Project created in Firebase:", createdProject);
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
        localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
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