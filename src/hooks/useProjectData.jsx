
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/firebaseAPI';
import { auth, database } from '@/services/firebase';
import { ref, onValue, set } from 'firebase/database';
import { mockProjects } from '@/data/mockProjects';

const useProjectData = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Format project dates
  const formatProjectDates = useCallback((projectData) => {
    if (!projectData) return null;
    
    const formattedProject = {
      ...projectData,
      id: projectId,
      dueDate: projectData.dueDate ? new Date(projectData.dueDate) : new Date(),
      meetings: Array.isArray(projectData.meetings) ? projectData.meetings.map(meeting => ({
        ...meeting,
        date: meeting.date ? new Date(meeting.date) : new Date()
      })) : [],
      commits: Array.isArray(projectData.commits) ? projectData.commits.map(commit => ({
        ...commit,
        date: commit.date ? new Date(commit.date) : new Date()
      })) : [],
      files: Array.isArray(projectData.files) ? projectData.files : [],
      pullRequests: Array.isArray(projectData.pullRequests) ? projectData.pullRequests : [],
      collaborators: Array.isArray(projectData.collaborators) ? projectData.collaborators : [],
      collaborationActivity: Array.isArray(projectData.collaborationActivity) ? projectData.collaborationActivity : [],
      members: Array.isArray(projectData.members) ? projectData.members : [],
    };
    
    return formattedProject;
  }, [projectId]);

  // Save project to localStorage
  const saveToLocalStorage = useCallback((projectData) => {
    try {
      if (!projectData || !projectId) return;
      
      const savedProjects = localStorage.getItem('user_projects') || '[]';
      let projects = [];
      
      try {
        projects = JSON.parse(savedProjects);
        if (!Array.isArray(projects)) projects = [];
      } catch (e) {
        console.error('Failed to parse saved projects:', e);
        projects = [];
      }
      
      const updatedProjects = projects.filter(p => p.id !== projectId);
      updatedProjects.push(projectData);
      
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
      console.log("Project saved to localStorage");
    } catch (e) {
      console.error('Failed to save project to localStorage:', e);
    }
  }, [projectId]);

  // Load project from localStorage or mock data
  const loadFromLocalStorage = useCallback(() => {
    console.log("Attempting to load project from localStorage");
    try {
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects)) {
          const foundProject = projects.find(p => p.id === projectId);
          if (foundProject) {
            console.log("Found project in localStorage:", foundProject);
            const formattedProject = formatProjectDates(foundProject);
            setProject(formattedProject);
            setIsLoading(false);
            setError(null);
            return formattedProject;
          }
        }
      }

      // If no match in localStorage, check mock projects
      console.log("No project found in localStorage, trying mock data");
      const foundMockProject = mockProjects.find(p => p.id === projectId);
      if (foundMockProject) {
        console.log("Using mock project data:", foundMockProject);
        const formattedProject = formatProjectDates(foundMockProject);
        setProject(formattedProject);
        setError(null);
        setIsLoading(false);
        
        // Save mock project to localStorage for consistency
        saveToLocalStorage(formattedProject);
        return formattedProject;
      } else {
        // No project found anywhere
        console.error("Project not found anywhere");
        setError("Project not found");
        toast({
          title: "Project not found",
          description: "The requested project could not be found",
          variant: "destructive"
        });
        setIsLoading(false);
        return null;
      }
    } catch (e) {
      console.error('Error loading project from localStorage:', e);
      setError("Error loading project");
      setIsLoading(false);
      return null;
    }
  }, [projectId, formatProjectDates, saveToLocalStorage]);

  // Load project data
  useEffect(() => {
    if (!projectId) return;
    
    let unsubscribe = () => {};
    let mounted = true;
    
    const loadProjectData = async () => {
      setIsLoading(true);
      
      try {
        // Try to directly read from Firebase if user is authenticated
        if (auth.currentUser) {
          console.log("Loading project data for:", projectId, "User:", auth.currentUser.uid);
          const projectRef = ref(database, `projects/${projectId}`);
          
          // Set up real-time listener
          unsubscribe = onValue(projectRef, (snapshot) => {
            if (!mounted) return;
            
            if (snapshot.exists()) {
              const projectData = snapshot.val();
              console.log("Project data loaded from Firebase:", projectData);
              
              const formattedProject = formatProjectDates(projectData);
              setProject(formattedProject);
              setIsLoading(false);
              setError(null);
              
              // Save to localStorage as backup
              saveToLocalStorage(formattedProject);
            } else {
              console.log("Project not found in Firebase, trying fallback methods");
              loadFromLocalStorage();
            }
          }, (error) => {
            if (!mounted) return;
            
            console.error("Firebase real-time listener error:", error);
            loadFromLocalStorage();
          });
        } else {
          console.log("No authenticated user, loading from localStorage");
          loadFromLocalStorage();
        }
      } catch (err) {
        if (!mounted) return;
        
        console.error('Error setting up project listener:', err);
        loadFromLocalStorage();
      }
    };
    
    loadProjectData();
    
    // Cleanup function
    return () => {
      mounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [projectId, formatProjectDates, loadFromLocalStorage, saveToLocalStorage]);

  // Save project changes
  const saveProjectChanges = useCallback(async (updatedProject) => {
    if (!updatedProject || !projectId) return project;
    
    try {
      console.log("Saving project changes:", updatedProject.id);
      
      // Prepare project for Firebase (convert dates to strings)
      const prepareForFirebase = (project) => {
        if (!project) return {};
        
        return {
          ...project,
          dueDate: project.dueDate instanceof Date 
            ? project.dueDate.toISOString() 
            : project.dueDate,
          meetings: Array.isArray(project.meetings) ? project.meetings.map(meeting => ({
            ...meeting,
            date: meeting.date instanceof Date ? meeting.date.toISOString() : meeting.date
          })) : [],
          commits: Array.isArray(project.commits) ? project.commits.map(commit => ({
            ...commit,
            date: commit.date instanceof Date ? commit.date.toISOString() : commit.date
          })) : []
        };
      };
      
      const firebaseProject = prepareForFirebase(updatedProject);
      
      // Try to update in Firebase if user is authenticated
      if (auth.currentUser) {
        try {
          if (projectAPI && projectAPI.updateProject) {
            await projectAPI.updateProject(projectId, firebaseProject);
            console.log("Project updated in Firebase");
          } else {
            // Direct Firebase update if API is not available
            const projectRef = ref(database, `projects/${projectId}`);
            await set(projectRef, firebaseProject);
            console.log("Project updated directly in Firebase");
          }
        } catch (firebaseError) {
          console.error("Failed to update in Firebase, saving to localStorage:", firebaseError);
          // Fall back to localStorage
          saveToLocalStorage(updatedProject);
        }
      } else {
        // Save to localStorage if no authenticated user
        console.log("No authenticated user, saving to localStorage only");
        saveToLocalStorage(updatedProject);
      }
      
      // Update local state
      setProject(updatedProject);
      
      return updatedProject;
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
  }, [projectId, project, saveToLocalStorage]);

  // Handle delete project
  const handleDeleteProject = useCallback(async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Try to delete from Firebase if user is authenticated
      if (auth.currentUser && projectAPI && projectAPI.deleteProject) {
        try {
          await projectAPI.deleteProject(projectId);
          console.log("Project deleted from Firebase");
        } catch (firebaseError) {
          console.error("Failed to delete from Firebase:", firebaseError);
        }
      }
      
      // Remove from localStorage
      try {
        const savedProjects = localStorage.getItem('user_projects') || '[]';
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
        console.log("Project removed from localStorage");
      } catch (e) {
        console.error('Failed to remove project from localStorage:', e);
      }
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted",
      });
      
      // Navigate back to projects
      navigate('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [projectId, navigate]);

  // Handle delete meeting
  const handleDeleteMeeting = useCallback((meetingId) => {
    if (!project || !meetingId) return;
    
    const updatedProject = {
      ...project,
      meetings: Array.isArray(project.meetings) 
        ? project.meetings.filter(meeting => meeting.id !== meetingId)
        : []
    };
    
    saveProjectChanges(updatedProject);
    
    toast({
      title: "Meeting deleted",
      description: "The meeting has been removed from the project"
    });
  }, [project, saveProjectChanges]);

  // Navigate back to dashboard
  const handleGoBack = useCallback(() => {
    navigate('/projects');
  }, [navigate]);

  return {
    project,
    isLoading,
    error,
    saveProjectChanges,
    handleDeleteProject,
    handleDeleteMeeting,
    handleGoBack
  };
};

export default useProjectData;
