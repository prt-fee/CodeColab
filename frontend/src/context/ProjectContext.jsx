
import React, { createContext, useContext, useState } from 'react';

// Create the context
const ProjectContext = createContext(null);

// Mock projects data
const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with new brand guidelines',
    color: 'blue',
    dueDate: new Date(2025, 5, 15),
    members: 5,
    tasksCount: {
      total: 12,
      completed: 8
    }
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a mobile app for iOS and Android platforms',
    color: 'green',
    dueDate: new Date(2025, 7, 30),
    members: 4,
    tasksCount: {
      total: 24,
      completed: 10
    }
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Q3 social media campaign for new product launch',
    color: 'purple',
    dueDate: new Date(2025, 8, 1),
    members: 3,
    tasksCount: {
      total: 18,
      completed: 2
    }
  }
];

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [activeProject, setActiveProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get a project by ID
  const getProject = (id) => {
    return projects.find(project => project.id === id) || null;
  };

  // Create a new project
  const createProject = (projectData) => {
    setIsLoading(true);
    
    try {
      // Generate a simple ID (in a real app, this would come from the backend)
      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        members: projectData.members || 1,
        tasksCount: {
          total: 0,
          completed: 0
        }
      };
      
      setProjects([...projects, newProject]);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing project
  const updateProject = (id, projectData) => {
    setIsLoading(true);
    
    try {
      const updatedProjects = projects.map(project => 
        project.id === id ? { ...project, ...projectData } : project
      );
      
      setProjects(updatedProjects);
      
      // If the active project was updated, also update it
      if (activeProject && activeProject.id === id) {
        setActiveProject({ ...activeProject, ...projectData });
      }
      
      return updatedProjects.find(project => project.id === id);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a project
  const deleteProject = (id) => {
    setIsLoading(true);
    
    try {
      const updatedProjects = projects.filter(project => project.id !== id);
      setProjects(updatedProjects);
      
      // If the active project was deleted, clear it
      if (activeProject && activeProject.id === id) {
        setActiveProject(null);
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set the currently active project
  const selectProject = (id) => {
    const project = getProject(id);
    setActiveProject(project);
    return project;
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      isLoading,
      getProject,
      createProject,
      updateProject,
      deleteProject,
      selectProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook to use the project context
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
