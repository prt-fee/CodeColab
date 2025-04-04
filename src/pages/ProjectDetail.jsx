
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationsContext';
import useProjectDetail from '@/hooks/useProjectDetail';
import ProjectDetailTabs from '@/components/project/ProjectDetailTabs';
import { NewFileDialog, NewMeetingDialog, NewTaskDialog, NewCommitDialog } from '@/components/project/ProjectDialogs';
import { ProjectDetailLoading, ProjectNotFound } from '@/components/project/ProjectDetailLoading';
import ProjectHeader from '@/components/project/detail/ProjectHeader';
import TeamMembersSheet from '@/components/project/detail/TeamMembersSheet';
import DeleteProjectDialog from '@/components/project/detail/DeleteProjectDialog';

// Mock users for search feature
const MOCK_USERS = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', avatar: '' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
  { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [teamSheetOpen, setTeamSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Extract the projectId from the URL params for clarity
  const projectId = id;
  
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
    handleDeleteMeeting,
    handleAddTask,
    handleAddCollaborator,
    handleRemoveCollaborator,
    handleDeleteProject,
    handleGoBack
  } = useProjectDetail(projectId);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim().length > 0) {
      const results = MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddUser = (user) => {
    if (!project || !project.members) {
      toast({
        title: "Error",
        description: "Project data is not available",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure members is an array
    const membersArray = Array.isArray(project.members) ? project.members : [];
    
    const isMember = membersArray.some(member => member.id === user.id);
    
    if (isMember) {
      toast({
        title: "User already added",
        description: `${user.name} is already a member of this project`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invitation sent",
      description: `Invitation has been sent to ${user.name}`
    });
    
    addNotification({
      type: 'invitation',
      message: `You've been invited to join the project "${project.title}"`,
      sender: {
        id: 'currentUser',
        name: 'Current User',
        avatar: ''
      },
      relatedProject: project.id
    });
    
    const newCollaborator = {
      id: Date.now().toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      role: 'editor',
      addedAt: new Date().toISOString()
    };
    
    handleAddCollaborator(newCollaborator);
    
    setSearchTerm('');
    setSearchResults([]);
  };

  const confirmDeleteProject = () => {
    handleDeleteProject();
    setDeleteDialogOpen(false);
    navigate('/dashboard');
  };

  if (isLoading) {
    return <ProjectDetailLoading onGoBack={handleGoBack} />;
  }

  if (!project) {
    return <ProjectNotFound onGoBack={handleGoBack} />;
  }

  // Ensure members is an array for rendering
  const membersArray = Array.isArray(project.members) ? project.members : [];

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
        {/* Project Header */}
        <ProjectHeader 
          project={project}
          membersArray={membersArray}
          formatDate={formatDate}
          onGoBack={handleGoBack}
          onDeleteClick={() => setDeleteDialogOpen(true)}
          onTeamClick={() => setTeamSheetOpen(true)}
        />
        
        {/* Main Project Tabs */}
        <ProjectDetailTabs
          project={{
            ...project,
            members: membersArray,
            collaborators: Array.isArray(project.collaborators) ? project.collaborators : []
          }}
          projectTasks={projectTasks}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSaveFile={handleSaveFile}
          onNewFileClick={() => setNewFileDialogOpen(true)}
          onCommitClick={() => setNewCommitDialogOpen(true)}
          onAddTaskClick={() => setNewTaskDialogOpen(true)}
          onAddMeetingClick={() => setNewMeetingDialogOpen(true)}
          onDeleteMeeting={handleDeleteMeeting}
          onAddCollaborator={handleAddCollaborator}
          onRemoveCollaborator={handleRemoveCollaborator}
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
        
        {/* Team Members Sheet */}
        <TeamMembersSheet
          isOpen={teamSheetOpen}
          onOpenChange={setTeamSheetOpen}
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          searchResults={searchResults}
          onAddUser={handleAddUser}
          membersArray={membersArray}
        />
        
        {/* Delete Project Dialog */}
        <DeleteProjectDialog
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirmDelete={confirmDeleteProject}
        />
      </div>
    </div>
  );
};

export default ProjectDetail;
