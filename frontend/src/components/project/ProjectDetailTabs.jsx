
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeEditorPanel from '@/components/project/CodeEditorPanel';
import TasksPanel from '@/components/project/TasksPanel';
import MeetingsPanel from '@/components/project/MeetingsPanel';
import StatsPanel from '@/components/project/StatsPanel';
import TeamPanel from '@/components/project/TeamPanel';
import VersionControlPanel from '@/components/project/VersionControlPanel';
import CollaborationPanel from '@/components/project/CollaborationPanel';
import { toast } from '@/hooks/use-toast';
import { staggerAnimation } from '@/lib/animations';

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
  onAddCollaborator,
  onRemoveCollaborator
}) => {
  const [activeTab, setActiveTab] = useState('code');
  const [contentElement, setContentElement] = useState(null);
  
  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Show toast for sections with no data
    if (value === 'meetings' && (!project.meetings || project.meetings.length === 0)) {
      toast({
        title: "No meetings scheduled",
        description: "Click 'Add Meeting' to schedule your first project meeting"
      });
    }
    
    if (value === 'tasks' && (!projectTasks || projectTasks.length === 0)) {
      toast({
        title: "No tasks created",
        description: "Click 'Add Task' to create your first task for this project"
      });
    }
  };
  
  // Apply animations when tab changes
  useEffect(() => {
    if (contentElement) {
      const children = Array.from(contentElement.children);
      staggerAnimation(children, 0.1, 0.3);
    }
  }, [activeTab, contentElement]);
  
  // Set reference to content element
  const contentRef = (element) => {
    if (element) {
      setContentElement(element);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="code">Code</TabsTrigger>
        <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="meetings">Meetings</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
        <TabsTrigger value="commits">Commits</TabsTrigger>
      </TabsList>
      
      <TabsContent value="code">
        <div ref={contentRef}>
          <CodeEditorPanel 
            files={project.files || []}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onSaveFile={onSaveFile}
            onNewFileClick={onNewFileClick}
            onCommitClick={onCommitClick}
            collaborators={project.collaborators || []}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="collaboration">
        <div ref={contentRef}>
          <CollaborationPanel 
            project={project}
            collaborators={project.collaborators || []}
            onAddCollaborator={onAddCollaborator}
            onRemoveCollaborator={onRemoveCollaborator}
          />
        </div>
      </TabsContent>
      
      <TabsContent value="tasks">
        <div ref={contentRef}>
          <TasksPanel 
            tasks={projectTasks}
            onAddTaskClick={onAddTaskClick} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="meetings">
        <div ref={contentRef}>
          <MeetingsPanel 
            meetings={project.meetings || []}
            onAddMeetingClick={onAddMeetingClick}
          />
        </div>
      </TabsContent>

      <TabsContent value="stats">
        <div ref={contentRef}>
          <StatsPanel 
            project={project} 
            projectTasks={projectTasks} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="team">
        <div ref={contentRef}>
          <TeamPanel 
            members={project.members || []} 
            onAddCollaborator={onAddCollaborator}
          />
        </div>
      </TabsContent>

      <TabsContent value="commits">
        <div ref={contentRef}>
          <VersionControlPanel 
            activeTab="commits"
            commits={project.commits || []}
            onNewCommitClick={onCommitClick}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectDetailTabs;
