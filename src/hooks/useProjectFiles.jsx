
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectFiles = (project) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('js');
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);

  // Initialize selectedFile with first file if available
  useEffect(() => {
    if (project && project.files && project.files.length > 0 && !selectedFile) {
      setSelectedFile(project.files[0]);
    }
  }, [project, selectedFile]);

  const handleSaveFile = (fileContent) => {
    if (!selectedFile) return;
    
    // Update the selected file's content
    const updatedFile = { ...selectedFile, content: fileContent };
    
    // In a real app, this would be an API call
    // For now, update in localStorage
    try {
      const savedProjects = localStorage.getItem('user_projects');
      
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const projectIndex = projects.findIndex(p => p.id === project.id);
        
        if (projectIndex !== -1) {
          const updatedProject = { ...projects[projectIndex] };
          
          if (!updatedProject.files) {
            updatedProject.files = [];
          }
          
          const fileIndex = updatedProject.files.findIndex(f => f.id === selectedFile.id);
          
          if (fileIndex !== -1) {
            updatedProject.files[fileIndex] = updatedFile;
          }
          
          projects[projectIndex] = updatedProject;
          localStorage.setItem('user_projects', JSON.stringify(projects));
          
          // Update local state
          setSelectedFile(updatedFile);
          
          toast({
            title: "File saved",
            description: `${updatedFile.name} has been saved`
          });
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: "Error",
        description: "Failed to save file",
        variant: "destructive"
      });
    }
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "File name is required",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure file has appropriate extension based on type
    let fileName = newFileName;
    const extensions = {
      js: '.js',
      html: '.html',
      css: '.css',
      md: '.md'
    };
    
    const extension = extensions[newFileType];
    
    if (!fileName.endsWith(extension)) {
      fileName += extension;
    }
    
    // Create new file object
    const newFile = {
      id: Date.now().toString(),
      name: fileName,
      content: '',
      language: newFileType,
      createdAt: new Date().toISOString()
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
          
          if (!updatedProject.files) {
            updatedProject.files = [];
          }
          
          updatedProject.files.push(newFile);
          projects[projectIndex] = updatedProject;
          
          localStorage.setItem('user_projects', JSON.stringify(projects));
          
          // Update local state
          setSelectedFile(newFile);
          setNewFileName('');
          setNewFileDialogOpen(false);
          
          toast({
            title: "File created",
            description: `${newFile.name} has been created`
          });
          
          // Force reload to update the project
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error creating file:', error);
      toast({
        title: "Error",
        description: "Failed to create file",
        variant: "destructive"
      });
    }
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
