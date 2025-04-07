
import { useState } from 'react';
import useProjectData from './useProjectData';
import useProjectFiles from './useProjectFiles';
import useProjectVersionControl from './useProjectVersionControl';
import useProjectMeetings from './useProjectMeetings';
import useProjectTasks from './useProjectTasks';
import useProjectCollaboration from './useProjectCollaboration';

const useProjectDetail = (projectId) => {
  const { 
    project, 
    isLoading, 
    saveProjectChanges,
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
    handleAddMeeting
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
    
    // Navigation
    handleGoBack
  };
};

export default useProjectDetail;
