
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

  // Load project data
  useEffect(() => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    // Function to format dates in project data
    const formatProjectDates = (projectData) => {
      const formattedProject = {
        ...projectData,
        id: projectId,
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
      if (!formattedProject.members) formattedProject.members = [];
      
      return formattedProject;
    };
    
    // Save project to localStorage for backup
    const saveToLocalStorage = (projectData) => {
      try {
        const savedProjects = localStorage.getItem('user_projects') || '[]';
        const projects = JSON.parse(savedProjects);
        const updatedProjects = projects.map(p => 
          p.id === projectId ? projectData : p
        );
        
        // If project doesn't exist in array, add it
        if (!projects.some(p => p.id === projectId)) {
          updatedProjects.push(projectData);
        }
        
        localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
        console.log("Project saved to localStorage");
      } catch (e) {
        console.error('Failed to save project to localStorage:', e);
      }
    };
    
    // Load project from localStorage
    const loadFromLocalStorage = () => {
      console.log("Attempting to load project from localStorage");
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        try {
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
        } catch (e) {
          console.error('Failed to parse saved projects:', e);
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
    };
    
    // Main function to load project data
    const loadProjectData = () => {
      try {
        // Try to directly read from Firebase if user is authenticated
        if (auth.currentUser) {
          console.log("Loading project data for:", projectId, "User:", auth.currentUser.uid);
          const projectRef = ref(database, `projects/${projectId}`);
          
          // Set up real-time listener
          const unsubscribe = onValue(projectRef, (snapshot) => {
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
            console.error("Firebase real-time listener error:", error);
            loadFromLocalStorage();
          });
          
          return unsubscribe;
        } else {
          console.log("No authenticated user, loading from localStorage");
          loadFromLocalStorage();
          return () => {};
        }
      } catch (err) {
        console.error('Error setting up project listener:', err);
        loadFromLocalStorage();
        return () => {};
      }
    };
    
    const unsubscribe = loadProjectData();
    
    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [projectId, auth.currentUser?.uid]);

  // Save project changes
  const saveProjectChanges = useCallback(async (updatedProject) => {
    try {
      console.log("Saving project changes:", updatedProject.id);
      
      // Prepare project for Firebase (convert dates to strings)
      const prepareForFirebase = (project) => {
        return {
          ...project,
          dueDate: project.dueDate instanceof Date 
            ? project.dueDate.toISOString() 
            : project.dueDate,
          meetings: project.meetings?.map(meeting => ({
            ...meeting,
            date: meeting.date instanceof Date ? meeting.date.toISOString() : meeting.date
          })),
          commits: project.commits?.map(commit => ({
            ...commit,
            date: commit.date instanceof Date ? commit.date.toISOString() : commit.date
          }))
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
  }, [projectId, project]);

  // Navigate back to dashboard
  const handleGoBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return {
    project,
    isLoading,
    error,
    saveProjectChanges,
    handleGoBack
  };
};

export default useProjectData;
