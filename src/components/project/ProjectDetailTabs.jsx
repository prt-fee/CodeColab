
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditorPanel from './CodeEditorPanel';
import TasksPanel from './TasksPanel';
import MeetingsPanel from './MeetingsPanel';
import VersionControlPanel from './VersionControlPanel';
import CollaborationPanel from './CollaborationPanel';
import StatsPanel from './StatsPanel';
import TeamPanel from './TeamPanel';

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
  const [activeTab, setActiveTab] = useState('files');

  return (
    <Tabs defaultValue="files" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-7 lg:grid-cols-7">
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="versioning">Commits</TabsTrigger>
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
      </TabsList>
      
      <TabsContent value="files" className="space-y-4">
        <CodeEditorPanel 
          project={project} 
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSaveFile={onSaveFile}
          onNewFileClick={onNewFileClick}
        />
      </TabsContent>
      
      <TabsContent value="tasks" className="space-y-4">
        <TasksPanel 
          tasks={projectTasks} 
          onAddTaskClick={onAddTaskClick}
        />
      </TabsContent>
      
      <TabsContent value="versioning" className="space-y-4">
        <VersionControlPanel 
          commits={project?.commits || []} 
          onCommitClick={onCommitClick}
        />
      </TabsContent>
      
      <TabsContent value="meetings" className="space-y-4">
        <MeetingsPanel 
          meetings={project?.meetings || []} 
          onAddMeetingClick={onAddMeetingClick}
          onDeleteMeeting={onDeleteMeeting}
        />
      </TabsContent>
      
      <TabsContent value="collaboration" className="space-y-4">
        <CollaborationPanel 
          project={project} 
        />
      </TabsContent>
      
      <TabsContent value="team" className="space-y-4">
        <TeamPanel 
          members={project?.members || []} 
          collaborators={project?.collaborators || []}
          onAddCollaborator={onAddCollaborator}
          onRemoveCollaborator={onRemoveCollaborator}
        />
      </TabsContent>
      
      <TabsContent value="stats" className="space-y-4">
        <StatsPanel project={project} />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailTabs;
