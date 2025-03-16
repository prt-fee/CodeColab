
import { useState, useEffect } from 'react';

const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        // In a real app, fetch from API
        // For now, get from localStorage
        const savedProjects = localStorage.getItem('user_projects');
        
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const foundProject = projects.find(p => p.id === projectId);
          
          if (foundProject) {
            setProject(foundProject);
          } else {
            setError('Project not found');
          }
        } else {
          setError('No projects found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Error loading project');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  return { project, isLoading, error };
};

export default useProject;
