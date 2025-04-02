
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/firebaseAPI';
import { listenTo } from '@/services/firebaseAPI';
import { mockProjects } from '@/data/mockProjects';

const useProjectData = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    try {
      // Set up real-time listener for the project
      const unsubscribe = listenTo(`projects/${projectId}`, (projectData) => {
        if (projectData) {
          // Format dates
          const formattedProject = {
            ...projectData,
            dueDate: projectData.dueDate ? new Date(projectData.dueDate) : new Date(),
          };
          
          // Format meeting dates
          if (formattedProject.meetings) {
            formattedProject.meetings = formattedProject.meetings.map(meeting => ({
              ...meeting,
              date: meeting.date ? new Date(meeting.date) : new Date()
            }));
          }
          
          // Format commit dates
          if (formattedProject.commits) {
            formattedProject.commits = formattedProject.commits.map(commit => ({
              ...commit,
              date: commit.date ? new Date(commit.date) : new Date()
            }));
          }
          
          // Ensure required arrays exist
          if (!formattedProject.files) formattedProject.files = [];
          if (!formattedProject.meetings) formattedProject.meetings = [];
          if (!formattedProject.commits) formattedProject.commits = [];
          if (!formattedProject.pullRequests) formattedProject.pullRequests = [];
          if (!formattedProject.collaborators) formattedProject.collaborators = [];
          if (!formattedProject.collaborationActivity) formattedProject.collaborationActivity = [];
          
          setProject(formattedProject);
          setIsLoading(false);
        } else {
          // Project doesn't exist in Firebase, try localStorage
          loadFromLocalStorage();
        }
      });
      
      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up project listener:', err);
      loadFromLocalStorage();
    }
  }, [projectId]);

  const loadFromLocalStorage = () => {
    // Try to load from localStorage if Firebase fails
    const savedProjects = localStorage.getItem('user_projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects)) {
          const foundProject = projects.find(p => p.id === projectId);
          if (foundProject) {
            // Ensure dates are properly parsed
            if (foundProject.dueDate) {
              foundProject.dueDate = new Date(foundProject.dueDate);
            }
            if (foundProject.meetings) {
              foundProject.meetings.forEach(m => {
                if (m.date) m.date = new Date(m.date);
              });
            }
            if (foundProject.commits) {
              foundProject.commits.forEach(c => {
                if (c.date) c.date = new Date(c.date);
              });
            }

            // Ensure required arrays exist
            if (!foundProject.files) foundProject.files = [];
            if (!foundProject.meetings) foundProject.meetings = [];
            if (!foundProject.commits) foundProject.commits = [];
            if (!foundProject.pullRequests) foundProject.pullRequests = [];
            if (!foundProject.collaborators) foundProject.collaborators = [];
            if (!foundProject.collaborationActivity) foundProject.collaborationActivity = [];
            
            setProject(foundProject);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse saved projects:', e);
      }
    }

    // If no matching project found in localStorage, check mock projects
    const foundMockProject = mockProjects.find(p => p.id === projectId);
    if (foundMockProject) {
      setProject(foundMockProject);
    } else {
      // No project found anywhere - handle missing project
      toast({
        title: "Project not found",
        description: "The requested project could not be found",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  // Save project changes to Firebase
  const saveProjectChanges = async (updatedProject) => {
    try {
      // For Firebase, we need to convert Date objects to strings
      const firebaseProject = {
        ...updatedProject,
        dueDate: updatedProject.dueDate instanceof Date 
          ? updatedProject.dueDate.toISOString() 
          : updatedProject.dueDate,
      };
      
      // Convert meeting dates
      if (firebaseProject.meetings) {
        firebaseProject.meetings = firebaseProject.meetings.map(meeting => ({
          ...meeting,
          date: meeting.date instanceof Date ? meeting.date.toISOString() : meeting.date
        }));
      }
      
      // Convert commit dates
      if (firebaseProject.commits) {
        firebaseProject.commits = firebaseProject.commits.map(commit => ({
          ...commit,
          date: commit.date instanceof Date ? commit.date.toISOString() : commit.date
        }));
      }
      
      // Update in Firebase
      await projectAPI.updateProject(projectId, firebaseProject);
      
      // Update local state
      setProject(updatedProject);
      
      // Also update in localStorage as backup
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        try {
          const projects = JSON.parse(savedProjects);
          if (Array.isArray(projects)) {
            const updatedProjects = projects.map(p => 
              p.id === projectId ? updatedProject : p
            );
            localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
          }
        } catch (e) {
          console.error('Failed to update project in localStorage:', e);
        }
      }
    } catch (error) {
      console.error('Error saving project changes:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save project changes",
        variant: "destructive"
      });
      
      // Continue using the current project state
      return project;
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return {
    project,
    isLoading,
    saveProjectChanges,
    handleGoBack
  };
};

export default useProjectData;
