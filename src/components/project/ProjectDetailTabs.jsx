
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditorPanel from '@/components/project/CodeEditorPanel';
import TasksPanel from '@/components/project/TasksPanel';
import MeetingsPanel from '@/components/project/MeetingsPanel';
import StatsPanel from '@/components/project/StatsPanel';
import TeamPanel from '@/components/project/TeamPanel';
import VersionControlPanel from '@/components/project/VersionControlPanel';

const ProjectDetailTabs = ({
  project,
  projectTasks,
  selectedFile,
  setSelectedFile,
  onSaveFile,
  onNewFileClick,
  onCommitClick,
  onAddTaskClick,
  onAddMeetingClick
}) => {
  return (
    <Tabs defaultValue="code" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="commits">Commits</TabsTrigger>
      </TabsList>
      
      <TabsContent value="code">
        <CodeEditorPanel 
          files={project.files || []}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSaveFile={onSaveFile}
          onNewFileClick={onNewFileClick}
          onCommitClick={onCommitClick}
        />
      </TabsContent>
      
      <TabsContent value="tasks">
        <TasksPanel 
          tasks={projectTasks}
          onAddTaskClick={onAddTaskClick} 
        />
      </TabsContent>
      
      <TabsContent value="meetings">
        <MeetingsPanel 
          meetings={project.meetings || []}
          onAddMeetingClick={onAddMeetingClick}
        />
      </TabsContent>

      <TabsContent value="stats">
        <StatsPanel 
          project={project} 
          projectTasks={projectTasks} 
        />
      </TabsContent>
      
      <TabsContent value="team">
        <TeamPanel 
          members={project.members || []} 
          projectTitle={project.title}
        />
      </TabsContent>

      <TabsContent value="commits">
        <VersionControlPanel 
          activeTab="commits"
          commits={project.commits || []}
          onNewCommitClick={onCommitClick}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailTabs;
