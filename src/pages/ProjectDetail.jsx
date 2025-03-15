
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CalendarDays, Users } from 'lucide-react';
import ProjectDetailTabs from '@/components/project/ProjectDetailTabs';
import { NewFileDialog, NewMeetingDialog, NewTaskDialog, NewCommitDialog } from '@/components/project/ProjectDialogs';
import useProjectDetail from '@/hooks/useProjectDetail';
import { toast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Button onClick={handleGoBack}>Go Back to Projects</Button>
        </div>
      </div>
    );
  }

  // Format the due date
  const formatDate = (date) => {
    if (!date) return 'No date set';
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <Button variant="outline" className="mb-6" onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span>Due: {formatDate(project.dueDate)}</span>
            </div>
            
            <div className="flex -space-x-2">
              {project.members && project.members.slice(0, 3).map((member, index) => (
                <div 
                  key={member.id || index} 
                  className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background"
                >
                  {member.name ? member.name.charAt(0) : `U${index}`}
                </div>
              ))}
              {project.members && project.members.length > 3 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs border-2 border-background">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
        
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
        
        {/* Dialogs */}
        <NewFileDialog
          isOpen={newFileDialogOpen}
          onOpenChange={setNewFileDialogOpen}
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          newFileType={newFileType}
          setNewFileType={setNewFileType}
          onAddFile={handleAddFile}
        />
        
        <NewMeetingDialog
          isOpen={newMeetingDialogOpen}
          onOpenChange={setNewMeetingDialogOpen}
          newMeeting={newMeeting}
          setNewMeeting={setNewMeeting}
          onAddMeeting={handleAddMeeting}
        />
        
        <NewTaskDialog
          isOpen={newTaskDialogOpen}
          onOpenChange={setNewTaskDialogOpen}
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={handleAddTask}
        />
        
        <NewCommitDialog
          isOpen={newCommitDialogOpen}
          onOpenChange={setNewCommitDialogOpen}
          commitMessage={commitMessage}
          setCommitMessage={setCommitMessage}
          onAddCommit={handleAddCommit}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
