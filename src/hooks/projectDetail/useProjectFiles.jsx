
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectFiles = (projectId, initialFiles = []) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('html');
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);

  const handleSaveFile = (fileContent) => {
    if (selectedFile) {
      // Get stored projects
      const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]');
      
      // Find the current project
      const projectIndex = storedProjects.findIndex(p => p.id === projectId);
      
      if (projectIndex !== -1) {
        // Update the file content
        const updatedProjects = [...storedProjects];
        const currentProject = {...updatedProjects[projectIndex]};
        
        if (!currentProject.files) {
          currentProject.files = [];
        }
        
        const fileIndex = currentProject.files.findIndex(f => f.id === selectedFile.id);
        
        if (fileIndex !== -1) {
          currentProject.files[fileIndex] = {
            ...currentProject.files[fileIndex],
            content: fileContent
          };
          
          updatedProjects[projectIndex] = currentProject;
          localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
          
          toast({
            title: "File saved",
            description: `${selectedFile.name} has been updated`,
          });
          
          return true;
        }
      }
    }
    
    return false;
  };

  const handleAddFile = () => {
    if (!newFileName) {
      toast({
        title: "Error",
        description: "File name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Get stored projects
    const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]');
    
    // Find the current project
    const projectIndex = storedProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      // Create a new file
      const newFile = {
        id: Date.now().toString(),
        name: newFileName,
        type: newFileType,
        content: '',
        createdAt: new Date().toISOString()
      };
      
      // Add the file to the project
      const updatedProjects = [...storedProjects];
      const currentProject = {...updatedProjects[projectIndex]};
      
      if (!currentProject.files) {
        currentProject.files = [];
      }
      
      currentProject.files.push(newFile);
      updatedProjects[projectIndex] = currentProject;
      
      // Update localStorage
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
      
      // Set the new file as selected
      setSelectedFile(newFile);
      
      // Clear the form and close the dialog
      setNewFileName('');
      setNewFileDialogOpen(false);
      
      toast({
        title: "File created",
        description: `${newFileName} has been added to the project`,
      });
      
      return true;
    }
    
    return false;
  };

  return {
    selectedFile,
    setSelectedFile,
    newFileName,
    setNewFileName,
    newFileType,
    setNewFileType,
    newFileDialogOpen,
    setNewFileDialogOpen,
    handleSaveFile,
    handleAddFile
  };
};

export default useProjectFiles;
