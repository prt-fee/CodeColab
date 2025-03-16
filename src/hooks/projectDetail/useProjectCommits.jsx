
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectCommits = (projectId) => {
  const [newCommitDialogOpen, setNewCommitDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');

  const handleAddCommit = () => {
    if (!commitMessage) {
      toast({
        title: "Error",
        description: "Commit message is required",
        variant: "destructive"
      });
      return false;
    }
    
    // Get stored projects
    const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]');
    
    // Find the current project
    const projectIndex = storedProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      // Create a new commit
      const commit = {
        id: Date.now().toString(),
        message: commitMessage,
        date: new Date().toISOString(),
        author: {
          name: 'Current User',
          email: 'user@example.com'
        },
        files: 1,
        additions: 10,
        deletions: 5
      };
      
      // Add the commit to the project
      const updatedProjects = [...storedProjects];
      const currentProject = {...updatedProjects[projectIndex]};
      
      if (!currentProject.commits) {
        currentProject.commits = [];
      }
      
      currentProject.commits.push(commit);
      updatedProjects[projectIndex] = currentProject;
      
      // Update localStorage
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
      
      // Clear the form and close the dialog
      setCommitMessage('');
      setNewCommitDialogOpen(false);
      
      toast({
        title: "Changes committed",
        description: "Your changes have been committed successfully",
      });
      
      return true;
    }
    
    return false;
  };

  return {
    newCommitDialogOpen,
    setNewCommitDialogOpen,
    commitMessage,
    setCommitMessage,
    handleAddCommit
  };
};

export default useProjectCommits;
