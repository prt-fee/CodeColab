
import React from 'react';
import { NewFileDialog, NewMeetingDialog, NewTaskDialog, NewCommitDialog } from '@/components/project/ProjectDialogs';

const ProjectDetailDialogs = ({
  newFileDialogOpen,
  setNewFileDialogOpen,
  newFileName,
  setNewFileName,
  newFileType,
  setNewFileType,
  onAddFile,
  
  newMeetingDialogOpen,
  setNewMeetingDialogOpen,
  newMeeting,
  setNewMeeting,
  onAddMeeting,
  newTaskDialogOpen,
  setNewTaskDialogOpen,
  newTask,
  setNewTask,
  onAddTask,
  
  newCommitDialogOpen,
  setNewCommitDialogOpen,
  commitMessage,
  setCommitMessage,
  onAddCommit
}) => {
  return (
    <>
      <NewFileDialog 
        isOpen={newFileDialogOpen}
        onOpenChange={setNewFileDialogOpen}
        newFileName={newFileName}
        setNewFileName={setNewFileName}
        newFileType={newFileType}
        setNewFileType={setNewFileType}
        onAddFile={onAddFile}
      />

      <NewMeetingDialog 
        isOpen={newMeetingDialogOpen}
        onOpenChange={setNewMeetingDialogOpen}
        newMeeting={newMeeting}
        setNewMeeting={setNewMeeting}
        onAddMeeting={onAddMeeting}
      />

      <NewTaskDialog 
        isOpen={newTaskDialogOpen}
        onOpenChange={setNewTaskDialogOpen}
        newTask={newTask}
        setNewTask={setNewTask}
        onAddTask={onAddTask}
      />

      <NewCommitDialog 
        isOpen={newCommitDialogOpen}
        onOpenChange={setNewCommitDialogOpen}
        commitMessage={commitMessage}
        setCommitMessage={setCommitMessage}
        onAddCommit={onAddCommit}
      />
    </>
  );
};

export default ProjectDetailDialogs;
