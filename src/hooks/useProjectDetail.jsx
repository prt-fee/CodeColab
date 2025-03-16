
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectFiles from './projectDetail/useProjectFiles';
import useProjectTasks from './projectDetail/useProjectTasks';
import useProjectMeetings from './projectDetail/useProjectMeetings';
import useProjectCommits from './projectDetail/useProjectCommits';
import { toast } from '@/hooks/use-toast';

const useProjectDetail = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load project data
  useEffect(() => {
    const fetchProject = () => {
      setIsLoading(true);
      
      try {
        // Get stored projects
        const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]');
        
        // Find the project with the given ID
        const foundProject = storedProjects.find(p => p.id === projectId);
        
        if (foundProject) {
          setProject(foundProject);
        } else {
          toast({
            title: "Project not found",
            description: "The requested project could not be found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Use custom hooks for different project features
  const filesHook = useProjectFiles(projectId, project?.files);
  const tasksHook = useProjectTasks(projectId);
  const meetingsHook = useProjectMeetings(projectId);
  const commitsHook = useProjectCommits(projectId);

  const handleGoBack = () => {
    navigate('/projects');
  };

  return {
    project,
    isLoading,
    handleGoBack,
    projectTasks: tasksHook.projectTasks,
    ...filesHook,
    ...tasksHook,
    ...meetingsHook,
    ...commitsHook
  };
};

export default useProjectDetail;
