
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditorPanel from '@/components/project/CodeEditorPanel';
import TasksPanel from '@/components/project/TasksPanel';
import MeetingsPanel from '@/components/project/MeetingsPanel';
import CollaborationPanel from '@/components/project/CollaborationPanel';
import StatsPanel from '@/components/project/StatsPanel';
import VersionControlPanel from '@/components/project/VersionControlPanel';
import ProjectDeployment from '@/components/project/ProjectDeployment';

const ProjectDetailTabs = ({
  project,
  projectTasks,
  selectedFile,
  setSelectedFile,
  onSaveFile,
  onNewFileClick,
  onCommitClick,
  onAddTaskClick,
  onAddMeetingClick,
  onDeleteMeeting,
  onAddCollaborator,
  onRemoveCollaborator
}) => {
  // Default tab is code
  const [activeTab, setActiveTab] = React.useState('code');

  if (!project) return null;

  return (
    <Tabs 
      defaultValue="code" 
      onValueChange={setActiveTab}
      className="mt-6"
    >
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-4">
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="version">Version Control</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="deployment">Deployment</TabsTrigger>
      </TabsList>

      <TabsContent value="code" className="mt-4">
        <CodeEditorPanel 
          files={project.files || []} 
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSaveFile={onSaveFile}
          onNewFileClick={onNewFileClick}
          onCommitClick={onCommitClick}
          collaborators={project.collaborators || project.members || []}
        />
      </TabsContent>

      <TabsContent value="tasks" className="mt-4">
        <TasksPanel 
          tasks={projectTasks || []} 
          projectMembers={project.members || []} 
          onAddTask={onAddTaskClick}
        />
      </TabsContent>

      <TabsContent value="meetings" className="mt-4">
        <MeetingsPanel 
          meetings={project.meetings || []} 
          members={project.members || []}
          onAddMeeting={onAddMeetingClick}
          onDeleteMeeting={onDeleteMeeting}
        />
      </TabsContent>

      <TabsContent value="version" className="mt-4">
        <VersionControlPanel 
          commits={project.commits || []} 
          onCommitClick={onCommitClick}
        />
      </TabsContent>

      <TabsContent value="collaboration" className="mt-4">
        <CollaborationPanel 
          collaborators={project.collaborators || project.members || []} 
          onAddCollaborator={onAddCollaborator}
          onRemoveCollaborator={onRemoveCollaborator}
        />
      </TabsContent>

      <TabsContent value="stats" className="mt-4">
        <StatsPanel project={project} tasks={projectTasks || []} />
      </TabsContent>

      <TabsContent value="deployment" className="mt-4">
        <ProjectDeployment project={project} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailTabs;
