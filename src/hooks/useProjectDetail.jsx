
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from './useProject';
import { useProjectFiles } from './useProjectFiles';
import { useProjectMeetings } from './useProjectMeetings';
import { useProjectTasks } from './useProjectTasks';
import { useProjectCommits } from './useProjectCommits';
import { toast } from '@/hooks/use-toast';

const useProjectDetail = (projectId) => {
  const navigate = useNavigate();
  
  // Use custom hooks for different project aspects
  const { project, isLoading, error } = useProject(projectId);
  const { 
    selectedFile, setSelectedFile,
    newFileName, setNewFileName,
    newFileType, setNewFileType,
    newFileDialogOpen, setNewFileDialogOpen,
    handleSaveFile,
    handleAddFile
  } = useProjectFiles(project);
  
  const {
    newMeetingDialogOpen, setNewMeetingDialogOpen,
    newMeeting, setNewMeeting,
    handleAddMeeting
  } = useProjectMeetings(project);
  
  const {
    projectTasks,
    newTaskDialogOpen, setNewTaskDialogOpen, 
    newTask, setNewTask,
    handleAddTask
  } = useProjectTasks(project);
  
  const {
    newCommitDialogOpen, setNewCommitDialogOpen,
    commitMessage, setCommitMessage,
    handleAddCommit
  } = useProjectCommits(project, selectedFile);
  
  // Navigate back to projects list
  const handleGoBack = () => {
    navigate('/projects');
  };
  
  return {
    project,
    isLoading,
    error,
    selectedFile, 
    setSelectedFile,
    projectTasks,
    newFileName, 
    setNewFileName,
    newFileType, 
    setNewFileType,
    newFileDialogOpen, 
    setNewFileDialogOpen,
    newMeetingDialogOpen, 
    setNewMeetingDialogOpen,
    newTaskDialogOpen, 
    setNewTaskDialogOpen,
    newCommitDialogOpen, 
    setNewCommitDialogOpen,
    commitMessage, 
    setCommitMessage,
    newMeeting, 
    setNewMeeting,
    newTask, 
    setNewTask,
    handleSaveFile,
    handleAddFile,
    handleAddCommit,
    handleAddMeeting,
    handleAddTask,
    handleGoBack
  };
};

export default useProjectDetail;
