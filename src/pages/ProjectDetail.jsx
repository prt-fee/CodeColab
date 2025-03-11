
import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import useProjectDetail from '@/hooks/useProjectDetail';
import ProjectDetailHeader from '@/components/project/ProjectDetailHeader';
import ProjectDetailTabs from '@/components/project/ProjectDetailTabs';
import ProjectDetailDialogs from '@/components/project/ProjectDetailDialogs';
import { ProjectDetailLoading, ProjectNotFound } from '@/components/project/ProjectDetailLoading';

const ProjectDetail = () => {
  const { id } = useParams();
  const {
    project,
    isLoading,
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
  } = useProjectDetail(id);

  if (isLoading) {
    return <ProjectDetailLoading />;
  }

  if (!project) {
    return <ProjectNotFound onGoBack={handleGoBack} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <ProjectDetailHeader 
          project={project}
          onGoBack={handleGoBack}
          onNewFileClick={() => setNewFileDialogOpen(true)}
          onScheduleMeetingClick={() => setNewMeetingDialogOpen(true)}
        />

        <ProjectDetailTabs 
          project={project}
          projectTasks={projectTasks}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSaveFile={handleSaveFile}
          onNewFileClick={() => setNewFileDialogOpen(true)}
          onCommitClick={() => setNewCommitDialogOpen(true)}
          onAddTaskClick={() => setNewTaskDialogOpen(true)} 
          onAddMeetingClick={() => setNewMeetingDialogOpen(true)}
        />

        <ProjectDetailDialogs 
          newFileDialogOpen={newFileDialogOpen}
          setNewFileDialogOpen={setNewFileDialogOpen}
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          newFileType={newFileType}
          setNewFileType={setNewFileType}
          onAddFile={handleAddFile}
          
          newMeetingDialogOpen={newMeetingDialogOpen}
          setNewMeetingDialogOpen={setNewMeetingDialogOpen}
          newMeeting={newMeeting}
          setNewMeeting={setNewMeeting}
          onAddMeeting={handleAddMeeting}
          
          newTaskDialogOpen={newTaskDialogOpen}
          setNewTaskDialogOpen={setNewTaskDialogOpen}
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={handleAddTask}
          
          newCommitDialogOpen={newCommitDialogOpen}
          setNewCommitDialogOpen={setNewCommitDialogOpen}
          commitMessage={commitMessage}
          setCommitMessage={setCommitMessage}
          onAddCommit={handleAddCommit}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
