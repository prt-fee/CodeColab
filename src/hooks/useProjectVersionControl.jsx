
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from '@/hooks/use-toast';

const useProjectVersionControl = (project, saveProjectChanges) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [newCommitDialogOpen, setNewCommitDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');

  const handleAddCommit = () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Error",
        description: "Commit message is required",
        variant: "destructive"
      });
      return;
    }

    const newCommit = {
      id: Date.now().toString(),
      message: commitMessage,
      author: user?.name || 'Current User',
      date: new Date()
    };
    
    // Create activity record
    const newActivity = {
      id: Date.now().toString(),
      type: 'commit',
      user: user?.name || 'You',
      target: 'main',
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} committed "${commitMessage}"`
    };
    
    const updatedCommits = [newCommit, ...(project.commits || [])];
    const updatedProject = {
      ...project,
      commits: updatedCommits,
      collaborationActivity: [newActivity, ...(project.collaborationActivity || [])]
    };
    
    saveProjectChanges(updatedProject);
    setCommitMessage('');
    setNewCommitDialogOpen(false);
    
    toast({
      title: "Changes committed",
      description: "Your changes have been committed successfully",
    });
    
    // Notify collaborators
    if (project.collaborators && project.collaborators.length > 0) {
      project.collaborators.forEach(collab => {
        addNotification({
          type: 'commit',
          message: `New commit in ${project.title}: "${commitMessage}"`,
          sender: {
            id: user?.id || 'currentUser',
            name: user?.name || 'Current User',
            avatar: user?.avatar || ''
          },
          relatedProject: project.id
        });
      });
    }
  };

  return {
    newCommitDialogOpen,
    setNewCommitDialogOpen,
    commitMessage,
    setCommitMessage,
    handleAddCommit
  };
};

export default useProjectVersionControl;
