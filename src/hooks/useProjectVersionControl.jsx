
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from '@/hooks/use-toast';

const useProjectVersionControl = (project, saveProjectChanges) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [newCommitDialogOpen, setNewCommitDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

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

  // Handle file upload for version control
  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const newFiles = Array.from(files).map(file => {
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type.split('/')[1] || 'unknown',
          size: file.size,
          content: '', // Actual content would be read from the file
          createdAt: new Date().toISOString(),
          lastEdited: new Date().toISOString()
        };
      });
      
      // Create activity records
      const newActivities = newFiles.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: 'upload',
        user: user?.name || 'You',
        target: file.name,
        timestamp: new Date().toISOString(),
        message: `${user?.name || 'You'} uploaded ${file.name}`
      }));
      
      const updatedFiles = [...(project.files || []), ...newFiles];
      const updatedProject = {
        ...project,
        files: updatedFiles,
        collaborationActivity: [...newActivities, ...(project.collaborationActivity || [])]
      };
      
      saveProjectChanges(updatedProject);
      
      toast({
        title: "Files uploaded",
        description: `Successfully uploaded ${newFiles.length} files`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    newCommitDialogOpen,
    setNewCommitDialogOpen,
    commitMessage,
    setCommitMessage,
    handleAddCommit,
    handleFileUpload,
    isUploading
  };
};

export default useProjectVersionControl;
