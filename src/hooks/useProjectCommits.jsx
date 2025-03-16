
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectCommits = (project, selectedFile) => {
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
    
    // Create commit object
    const newCommit = {
      id: Date.now().toString(),
      message: commitMessage,
      date: new Date().toISOString(),
      author: {
        name: 'You',
        avatar: ''
      },
      files: selectedFile ? [selectedFile.name] : ['Unknown file'],
      hash: Math.random().toString(16).substring(2, 10)
    };
    
    // In a real app, this would be an API call
    // For now, update in localStorage
    try {
      const savedProjects = localStorage.getItem('user_projects');
      
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const projectIndex = projects.findIndex(p => p.id === project.id);
        
        if (projectIndex !== -1) {
          const updatedProject = { ...projects[projectIndex] };
          
          if (!updatedProject.commits) {
            updatedProject.commits = [];
          }
          
          updatedProject.commits.push(newCommit);
          projects[projectIndex] = updatedProject;
          
          localStorage.setItem('user_projects', JSON.stringify(projects));
          
          // Reset form
          setCommitMessage('');
          setNewCommitDialogOpen(false);
          
          toast({
            title: "Changes committed",
            description: `Commit "${newCommit.message}" has been created`
          });
          
          // Force reload to update the project
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error creating commit:', error);
      toast({
        title: "Error",
        description: "Failed to create commit",
        variant: "destructive"
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

export default useProjectCommits;
