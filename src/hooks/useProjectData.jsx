
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { mockProjects } from '@/data/mockProjects';

const useProjectData = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProject = () => {
      // First try to load from localStorage
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
              if (foundProject.pullRequests) {
                foundProject.pullRequests.forEach(pr => {
                  if (pr.date) pr.date = new Date(pr.date);
                });
              }
              
              // Initialize members array if it's a number instead
              if (typeof foundProject.members === 'number') {
                foundProject.members = Array.from({ length: foundProject.members }, (_, i) => ({
                  id: (i + 1).toString(),
                  name: `Team Member ${i + 1}`,
                  email: `member${i + 1}@example.com`,
                  avatar: `https://i.pravatar.cc/150?img=${20 + i}`
                }));
              }
              
              // Set default arrays if missing
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
    
    setTimeout(loadProject, 800);
  }, [projectId]);

  // Save project changes to localStorage
  const saveProjectChanges = (updatedProject) => {
    setProject(updatedProject);
    
    // Update in localStorage
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
