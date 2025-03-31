
import { useState } from 'react';
import useProjectData from './useProjectData';
import useProjectFiles from './useProjectFiles';
import useProjectVersionControl from './useProjectVersionControl';
import useProjectMeetings from './useProjectMeetings';
import useProjectTasks from './useProjectTasks';
import useProjectCollaboration from './useProjectCollaboration';
import { toast } from '@/hooks/use-toast';

const useProjectDetail = (projectId) => {
  const { 
    project, 
    isLoading, 
    saveProjectChanges,
    deleteProject,
    handleGoBack 
  } = useProjectData(projectId);

  const {
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
  } = useProjectFiles(project, saveProjectChanges);

  const {
    newCommitDialogOpen,
    setNewCommitDialogOpen,
    commitMessage,
    setCommitMessage,
    handleAddCommit
  } = useProjectVersionControl(project, saveProjectChanges);

  const {
    newMeetingDialogOpen,
    setNewMeetingDialogOpen,
    newMeeting,
    setNewMeeting,
    handleAddMeeting,
    handleDeleteMeeting
  } = useProjectMeetings(project, saveProjectChanges);

  const {
    projectTasks,
    newTaskDialogOpen,
    setNewTaskDialogOpen,
    newTask,
    setNewTask,
    handleAddTask
  } = useProjectTasks(projectId, project, saveProjectChanges);

  const {
    handleAddCollaborator,
    handleRemoveCollaborator
  } = useProjectCollaboration(project, saveProjectChanges);
  
  const handleDeleteProject = () => {
    if (!project) {
      toast({
        title: "Error",
        description: "Project data is not available",
        variant: "destructive"
      });
      return;
    }
    
    deleteProject(projectId);
    
    toast({
      title: "Project deleted",
      description: `"${project.title}" has been permanently deleted`,
    });
  };

  return {
    // Project data
    project,
    isLoading,
    
    // Files management
    selectedFile, 
    setSelectedFile,
    newFileName, 
    setNewFileName,
    newFileType, 
    setNewFileType,
    newFileDialogOpen, 
    setNewFileDialogOpen,
    handleSaveFile,
    handleAddFile,
    
    // Version control
    newCommitDialogOpen, 
    setNewCommitDialogOpen,
    commitMessage, 
    setCommitMessage,
    handleAddCommit,
    
    // Meetings
    newMeetingDialogOpen, 
    setNewMeetingDialogOpen,
    newMeeting, 
    setNewMeeting,
    handleAddMeeting,
    handleDeleteMeeting,
    
    // Tasks
    projectTasks,
    newTaskDialogOpen, 
    setNewTaskDialogOpen,
    newTask, 
    setNewTask,
    handleAddTask,
    
    // Collaboration
    handleAddCollaborator,
    handleRemoveCollaborator,
    
    // Project Management
    handleDeleteProject,
    
    // Navigation
    handleGoBack
  };
};

export default useProjectDetail;
