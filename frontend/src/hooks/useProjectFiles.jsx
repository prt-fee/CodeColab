
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

const useProjectFiles = (project, saveProjectChanges) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(
    project?.files && project.files.length > 0 ? project.files[0] : null
  );
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('js');
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);

  const handleSaveFile = (fileId, newContent) => {
    if (!project || !project.files) return;
    
    const updatedFiles = project.files.map(file => 
      file.id === fileId ? { ...file, content: newContent, lastEdited: new Date().toISOString() } : file
    );
    
    // Create activity record
    const editedFile = project.files.find(f => f.id === fileId);
    const newActivity = {
      id: Date.now().toString(),
      type: 'edit',
      user: user?.name || 'You',
      target: editedFile?.name || 'a file',
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} edited ${editedFile?.name || 'a file'}`
    };
    
    const updatedProject = {
      ...project,
      files: updatedFiles,
      collaborationActivity: [newActivity, ...(project.collaborationActivity || [])]
    };
    
    saveProjectChanges(updatedProject);
    
    toast({
      title: "File saved",
      description: `Changes to ${updatedFiles.find(f => f.id === fileId).name} have been saved`,
    });
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

    const newFile = {
      id: Date.now().toString(),
      name: newFileName.includes('.') ? newFileName : `${newFileName}.${newFileType}`,
      type: newFileType,
      content: '',
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString()
    };
    
    // Create activity record
    const newActivity = {
      id: Date.now().toString(),
      type: 'edit',
      user: user?.name || 'You',
      target: newFile.name,
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} created ${newFile.name}`
    };
    
    const updatedFiles = project.files ? [...project.files, newFile] : [newFile];
    const updatedProject = {
      ...project,
      files: updatedFiles,
      collaborationActivity: [newActivity, ...(project.collaborationActivity || [])]
    };
    
    saveProjectChanges(updatedProject);
    setSelectedFile(newFile);
    setNewFileName('');
    setNewFileDialogOpen(false);
    
    toast({
      title: "File created",
      description: `${newFile.name} has been created`,
    });
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
