
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from '@/hooks/use-toast';
// import { mockProjects } from '@/data/mockProjects';

// const useProjectData = (projectId) => {
//   const [project, setProject] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadProject = () => {
//       // First try to load from localStorage
//       const savedProjects = localStorage.getItem('user_projects');
//       if (savedProjects) {
//         try {
//           const projects = JSON.parse(savedProjects);
//           if (Array.isArray(projects)) {
//             const foundProject = projects.find(p => p.id === projectId);
//             if (foundProject) {
//               // Ensure dates are properly parsed
//               if (foundProject.dueDate) {
//                 foundProject.dueDate = new Date(foundProject.dueDate);
//               }
//               if (foundProject.meetings) {
//                 foundProject.meetings.forEach(m => {
//                   if (m.date) m.date = new Date(m.date);
//                 });
//               }
//               if (foundProject.commits) {
//                 foundProject.commits.forEach(c => {
//                   if (c.date) c.date = new Date(c.date);
//                 });
//               }
//               if (foundProject.pullRequests) {
//                 foundProject.pullRequests.forEach(pr => {
//                   if (pr.date) pr.date = new Date(pr.date);
//                 });
//               }
              
//               // Initialize members array if it's a number instead
//               if (typeof foundProject.members === 'number') {
//                 foundProject.members = Array.from({ length: foundProject.members }, (_, i) => ({
//                   id: (i + 1).toString(),
//                   name: `Team Member ${i + 1}`,
//                   email: `member${i + 1}@example.com`,
//                   avatar: `https://i.pravatar.cc/150?img=${20 + i}`
//                 }));
//               }
              
//               // Set default arrays if missing
//               if (!foundProject.files) foundProject.files = [];
//               if (!foundProject.meetings) foundProject.meetings = [];
//               if (!foundProject.commits) foundProject.commits = [];
//               if (!foundProject.pullRequests) foundProject.pullRequests = [];
//               if (!foundProject.collaborators) foundProject.collaborators = [];
//               if (!foundProject.collaborationActivity) foundProject.collaborationActivity = [];
              
//               setProject(foundProject);
//               setIsLoading(false);
//               return;
//             }
//           }
//         } catch (e) {
//           console.error('Failed to parse saved projects:', e);
//         }
//       }

//       // If no matching project found in localStorage, check mock projects
//       const foundMockProject = mockProjects.find(p => p.id === projectId);
//       if (foundMockProject) {
//         setProject(foundMockProject);
//       } else {
//         // No project found anywhere - handle missing project
//         toast({
//           title: "Project not found",
//           description: "The requested project could not be found",
//           variant: "destructive"
//         });
//       }
//       setIsLoading(false);
//     };
    
//     setTimeout(loadProject, 800);
//   }, [projectId]);

//   // Save project changes to localStorage
//   const saveProjectChanges = (updatedProject) => {
//     setProject(updatedProject);
    
//     // Update in localStorage
//     const savedProjects = localStorage.getItem('user_projects');
//     if (savedProjects) {
//       try {
//         const projects = JSON.parse(savedProjects);
//         if (Array.isArray(projects)) {
//           const updatedProjects = projects.map(p => 
//             p.id === projectId ? updatedProject : p
//           );
//           localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
//         }
//       } catch (e) {
//         console.error('Failed to update project in localStorage:', e);
//       }
//     }
//   };

//   const handleGoBack = () => {
//     navigate('/dashboard');
//   };

//   return {
//     project,
//     isLoading,
//     saveProjectChanges,
//     handleGoBack
//   };
// };

// export default useProjectData;




import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { projectAPI } from '@/services/firebaseAPI';
import { listenTo } from '@/services/firebaseAPI';
import { mockProjects } from '@/data/mockProjects';
import { auth, database } from '@/services/firebase';
import { ref, onValue, get, set } from 'firebase/database';

const useProjectData = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;
    
    setIsLoading(true);
    
    const loadProjectData = async () => {
      try {
        // First, try to directly read from Firebase
        if (auth.currentUser) {
          console.log("Loading project data for:", projectId, "User:", auth.currentUser.uid);
          
          const projectRef = ref(database, `projects/${projectId}`);
          
          // Set up real-time listener
          const unsubscribe = onValue(projectRef, (snapshot) => {
            if (snapshot.exists()) {
              const projectData = snapshot.val();
              console.log("Project data loaded:", projectData);
              
              // Format dates
              const formattedProject = {
                ...projectData,
                id: projectId, // Ensure ID is set
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
              
              setProject(formattedProject);
              setIsLoading(false);
              setError(null);
              
              // Also save to localStorage as backup
              try {
                const savedProjects = localStorage.getItem('user_projects') || '[]';
                const projects = JSON.parse(savedProjects);
                const updatedProjects = projects.map(p => 
                  p.id === projectId ? formattedProject : p
                );
                
                // If project doesn't exist in array, add it
                if (!projects.some(p => p.id === projectId)) {
                  updatedProjects.push(formattedProject);
                }
                
                localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
              } catch (e) {
                console.error("Failed to update localStorage:", e);
              }
            } else {
              console.log("Project not found in Firebase, trying fallback methods");
              loadFromLocalStorage();
            }
          }, (error) => {
            console.error("Firebase real-time listener error:", error);
            loadFromLocalStorage();
          });
          
          return () => {
            unsubscribe();
          };
        } else {
          console.log("No authenticated user, loading from localStorage");
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error('Error setting up project listener:', err);
        loadFromLocalStorage();
      }
    };
    
    loadProjectData();
  }, [projectId, auth.currentUser?.uid]);

  const loadFromLocalStorage = () => {
    console.log("Attempting to load project from localStorage");
    // Try to load from localStorage if Firebase fails
    const savedProjects = localStorage.getItem('user_projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects)) {
          const foundProject = projects.find(p => p.id === projectId);
          if (foundProject) {
            console.log("Found project in localStorage:", foundProject);
            
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
            if (!foundProject.members) foundProject.members = [];
            
            setProject(foundProject);
            setIsLoading(false);
            setError(null);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse saved projects:', e);
      }
    }

    // If no matching project found in localStorage, check mock projects
    console.log("No project found in localStorage, trying mock data");
    const foundMockProject = mockProjects.find(p => p.id === projectId);
    if (foundMockProject) {
      console.log("Using mock project data:", foundMockProject);
      setProject(foundMockProject);
      setError(null);
    } else {
      // No project found anywhere - handle missing project
      console.error("Project not found anywhere");
      setError("Project not found");
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
      console.log("Saving project changes:", updatedProject.id);
      
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
      
      // If there's an authenticated user, try to update in Firebase
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
  };

  const saveToLocalStorage = (updatedProject) => {
    try {
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects)) {
          const updatedProjects = projects.map(p => 
            p.id === projectId ? updatedProject : p
          );
          
          // If project doesn't exist in array, add it
          if (!projects.some(p => p.id === projectId)) {
            updatedProjects.push(updatedProject);
          }
          
          localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
          console.log("Project saved to localStorage");
        }
      } else {
        // No projects in localStorage yet, create array with this project
        localStorage.setItem('user_projects', JSON.stringify([updatedProject]));
        console.log("Created new projects array in localStorage");
      }
    } catch (e) {
      console.error('Failed to save project to localStorage:', e);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return {
    project,
    isLoading,
    error,
    saveProjectChanges,
    handleGoBack
  };
};

export default useProjectData;