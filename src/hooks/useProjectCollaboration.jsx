
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from '@/hooks/use-toast';

const useProjectCollaboration = (project, saveProjectChanges) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const handleAddCollaborator = (collaborator) => {
    if (!project) return;
    
    // Check if already a collaborator
    if (project.collaborators && project.collaborators.some(c => c.email === collaborator.email)) {
      toast({
        title: "Already a collaborator",
        description: `${collaborator.email} is already a collaborator on this project`,
        variant: "destructive"
      });
      return;
    }
    
    // Create activity record
    const newActivity = {
      id: Date.now().toString(),
      type: 'invitation',
      user: user?.name || 'You',
      target: collaborator.email,
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} invited ${collaborator.email} to collaborate`
    };
    
    const updatedProject = {
      ...project,
      collaborators: [...(project.collaborators || []), collaborator],
      collaborationActivity: [newActivity, ...(project.collaborationActivity || [])]
    };
    
    saveProjectChanges(updatedProject);
    
    toast({
      title: "Collaborator added",
      description: `${collaborator.email} has been added as a collaborator`,
    });
    
    // Send notification
    addNotification({
      type: 'invitation',
      message: `You've been invited to collaborate on project "${project.title}"`,
      sender: {
        id: user?.id || 'currentUser',
        name: user?.name || 'Current User',
        avatar: user?.avatar || ''
      },
      relatedProject: project.id
    });
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    if (!project || !project.collaborators) return;
    
    const collaborator = project.collaborators.find(c => c.id === collaboratorId);
    if (!collaborator) return;
    
    const updatedCollaborators = project.collaborators.filter(c => c.id !== collaboratorId);
    
    // Create activity record
    const newActivity = {
      id: Date.now().toString(),
      type: 'removal',
      user: user?.name || 'You',
      target: collaborator.email,
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} removed ${collaborator.email} from collaborators`
    };
    
    const updatedProject = {
      ...project,
      collaborators: updatedCollaborators,
      collaborationActivity: [newActivity, ...(project.collaborationActivity || [])]
    };
    
    saveProjectChanges(updatedProject);
    
    toast({
      title: "Collaborator removed",
      description: `${collaborator.email} has been removed from the project`,
    });
  };

  return {
    handleAddCollaborator,
    handleRemoveCollaborator
  };
};

export default useProjectCollaboration;
