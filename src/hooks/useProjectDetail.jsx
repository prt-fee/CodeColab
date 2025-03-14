
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTaskManager } from '@/hooks/useTaskManager';
import { toast } from '@/hooks/use-toast';

// Mock project templates - moved from ProjectDetail component
const mockProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and feel',
    color: 'blue',
    dueDate: new Date('2023-06-30'),
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' }
    ],
    tasksCount: {
      total: 12,
      completed: 8
    },
    files: [
      { id: '1', name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Website Redesign</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
      { id: '2', name: 'styles.css', type: 'css', content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}\n\nh1 {\n  color: #333;\n}' },
      { id: '3', name: 'script.js', type: 'js', content: 'document.addEventListener("DOMContentLoaded", function() {\n  console.log("Document ready!");\n});' }
    ],
    meetings: [
      { id: '1', title: 'Project Kickoff', date: new Date('2023-05-15T10:00:00'), duration: 60, attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'] },
      { id: '2', title: 'Design Review', date: new Date('2023-05-22T14:00:00'), duration: 45, attendees: ['John Doe', 'Sarah Williams'] },
      { id: '3', title: 'Progress Update', date: new Date('2023-05-29T11:00:00'), duration: 30, attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'] }
    ],
    commits: [
      { id: '1', message: 'Initial commit', author: 'John Doe', date: new Date('2023-05-10T10:00:00') },
      { id: '2', message: 'Add header styles', author: 'Jane Smith', date: new Date('2023-05-12T14:30:00') },
      { id: '3', message: 'Fix navigation menu', author: 'Mike Johnson', date: new Date('2023-05-14T09:15:00') }
    ],
    pullRequests: [
      { id: '1', title: 'Feature: Add contact form', author: 'Jane Smith', status: 'open', date: new Date('2023-05-14T15:20:00') },
      { id: '2', title: 'Fix: Mobile responsive layout', author: 'Mike Johnson', status: 'merged', date: new Date('2023-05-13T11:45:00') }
    ]
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a new mobile app for customer engagement',
    color: 'green',
    dueDate: new Date('2023-08-15'),
    members: [
      { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' }
    ],
    tasksCount: {
      total: 20,
      completed: 5
    },
    files: [
      { id: '1', name: 'App.js', type: 'js', content: 'import React from "react";\n\nconst App = () => {\n  return (\n    <div>\n      <h1>Mobile App</h1>\n    </div>\n  );\n};\n\nexport default App;' },
      { id: '2', name: 'styles.css', type: 'css', content: 'body {\n  font-family: Arial, sans-serif;\n}\n\nh1 {\n  color: green;\n}' }
    ],
    meetings: [
      { id: '1', title: 'Sprint Planning', date: new Date('2023-05-16T09:00:00'), duration: 90, attendees: ['John Doe', 'Jane Smith'] },
      { id: '2', title: 'Client Demo', date: new Date('2023-05-30T15:00:00'), duration: 60, attendees: ['John Doe', 'Jane Smith'] }
    ],
    commits: [
      { id: '1', message: 'Initial setup', author: 'John Doe', date: new Date('2023-05-08T10:00:00') },
      { id: '2', message: 'Create app structure', author: 'Jane Smith', date: new Date('2023-05-10T14:30:00') }
    ],
    pullRequests: [
      { id: '1', title: 'Feature: User authentication', author: 'John Doe', status: 'open', date: new Date('2023-05-12T15:20:00') }
    ]
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Plan and execute Q3 marketing campaign',
    color: 'orange',
    dueDate: new Date('2023-07-10'),
    members: [
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', name: 'Alex Brown', email: 'alex@example.com', avatar: 'https://i.pravatar.cc/150?img=5' }
    ],
    tasksCount: {
      total: 8,
      completed: 2
    },
    files: [
      { id: '1', name: 'campaign.md', type: 'md', content: '# Marketing Campaign\n\n## Objectives\n\n- Increase brand awareness\n- Generate leads\n- Drive website traffic\n\n## Target Audience\n\n- Small to medium businesses\n- Tech enthusiasts\n- Decision makers' },
      { id: '2', name: 'budget.csv', type: 'csv', content: 'Item,Budget,Actual\nSocial Media,$2000,$1850\nEmail Marketing,$1500,$1500\nContent Creation,$3000,$3200\nPaid Ads,$5000,$4800' }
    ],
    meetings: [
      { id: '1', title: 'Campaign Strategy', date: new Date('2023-05-17T11:00:00'), duration: 60, attendees: ['Mike Johnson', 'Sarah Williams', 'Alex Brown'] }
    ],
    commits: [
      { id: '1', message: 'Add campaign overview', author: 'Mike Johnson', date: new Date('2023-05-09T11:00:00') },
      { id: '2', message: 'Update budget details', author: 'Sarah Williams', date: new Date('2023-05-11T13:45:00') }
    ],
    pullRequests: []
  }
];

const useProjectDetail = (projectId) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tasks, getTasksByProject, addTask } = useTaskManager();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  
  // Dialog states
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState('js');
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false);
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newCommitDialogOpen, setNewCommitDialogOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    attendees: []
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'todo'
  });

  useEffect(() => {
    const loadProject = () => {
      // First try to load from localStorage
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        try {
          const projects = JSON.parse(savedProjects);
          if (Array.isArray(projects)) {
            const foundProject = projects.find(p => p.id === projectId);
            if (foundProject) {
              // Ensure dates are properly parsed
              if (foundProject.dueDate) {
                foundProject.dueDate = new Date(foundProject.dueDate);
              }
              if (foundProject.meetings) {
                foundProject.meetings.forEach(m => {
                  if (m.date) m.date = new Date(m.date);
                });
              }
              if (foundProject.commits) {
                foundProject.commits.forEach(c => {
                  if (c.date) c.date = new Date(c.date);
                });
              }
              if (foundProject.pullRequests) {
                foundProject.pullRequests.forEach(pr => {
                  if (pr.date) pr.date = new Date(pr.date);
                });
              }
              
              // Initialize members array if it's a number instead
              if (typeof foundProject.members === 'number') {
                foundProject.members = Array.from({ length: foundProject.members }, (_, i) => ({
                  id: (i + 1).toString(),
                  name: `Team Member ${i + 1}`,
                  email: `member${i + 1}@example.com`,
                  avatar: `https://i.pravatar.cc/150?img=${20 + i}`
                }));
              }
              
              // Set default arrays if missing
              if (!foundProject.files) foundProject.files = [];
              if (!foundProject.meetings) foundProject.meetings = [];
              if (!foundProject.commits) foundProject.commits = [];
              if (!foundProject.pullRequests) foundProject.pullRequests = [];
              
              setProject(foundProject);
              setSelectedFile(foundProject.files && foundProject.files.length > 0 ? foundProject.files[0] : null);
              
              const filteredTasks = tasks.filter(task => task.projectId === projectId);
              setProjectTasks(filteredTasks);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error('Failed to parse saved projects:', e);
        }
      }

      // If no matching project found in localStorage, check mock projects
      const foundMockProject = mockProjects.find(p => p.id === projectId);
      if (foundMockProject) {
        setProject(foundMockProject);
        setSelectedFile(foundMockProject.files && foundMockProject.files.length > 0 ? foundMockProject.files[0] : null);
        
        const filteredTasks = tasks.filter(task => task.projectId === projectId);
        setProjectTasks(filteredTasks);
      } else {
        // No project found anywhere - handle missing project
        toast({
          title: "Project not found",
          description: "The requested project could not be found",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    };
    
    setTimeout(loadProject, 800);
  }, [projectId, tasks]);

  // Save project changes to localStorage
  const saveProjectChanges = (updatedProject) => {
    setProject(updatedProject);
    
    // Update in localStorage
    const savedProjects = localStorage.getItem('user_projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects)) {
          const updatedProjects = projects.map(p => 
            p.id === projectId ? updatedProject : p
          );
          localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
        }
      } catch (e) {
        console.error('Failed to update project in localStorage:', e);
      }
    }
  };

  const handleSaveFile = (fileId, newContent) => {
    if (!project || !project.files) return;
    
    const updatedFiles = project.files.map(file => 
      file.id === fileId ? { ...file, content: newContent } : file
    );
    
    const updatedProject = {
      ...project,
      files: updatedFiles
    };
    
    saveProjectChanges(updatedProject);
    
    toast({
      title: "File saved",
      description: `Changes to ${updatedFiles.find(f => f.id === fileId).name} have been saved`,
    });
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "File name is required",
        variant: "destructive"
      });
      return;
    }

    const newFile = {
      id: Date.now().toString(),
      name: newFileName.includes('.') ? newFileName : `${newFileName}.${newFileType}`,
      type: newFileType,
      content: ''
    };
    
    const updatedFiles = project.files ? [...project.files, newFile] : [newFile];
    const updatedProject = {
      ...project,
      files: updatedFiles
    };
    
    saveProjectChanges(updatedProject);
    setSelectedFile(newFile);
    setNewFileName('');
    setNewFileDialogOpen(false);
    
    toast({
      title: "File created",
      description: `${newFile.name} has been created`,
    });
  };

  const handleAddCommit = () => {
    if (!commitMessage.trim()) {
      toast({
        title: "Error",
        description: "Commit message is required",
        variant: "destructive"
      });
      return;
    }

    const newCommit = {
      id: Date.now().toString(),
      message: commitMessage,
      author: user?.name || 'Current User',
      date: new Date()
    };
    
    const updatedCommits = [newCommit, ...(project.commits || [])];
    const updatedProject = {
      ...project,
      commits: updatedCommits
    };
    
    saveProjectChanges(updatedProject);
    setCommitMessage('');
    setNewCommitDialogOpen(false);
    
    toast({
      title: "Changes committed",
      description: "Your changes have been committed successfully",
    });
  };

  const handleAddMeeting = () => {
    if (!newMeeting.title.trim()) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return;
    }

    const dateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
    
    const memberNames = project.members?.slice(0, 2).map(member => member.name) || [];
    
    const newMeetingData = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: dateTime,
      duration: parseInt(newMeeting.duration),
      attendees: memberNames.length > 0 ? memberNames : ['You']
    };
    
    const updatedMeetings = [...(project.meetings || []), newMeetingData];
    const updatedProject = {
      ...project,
      meetings: updatedMeetings
    };
    
    saveProjectChanges(updatedProject);

    setNewMeeting({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 30,
      attendees: []
    });
    
    setNewMeetingDialogOpen(false);
    
    toast({
      title: "Meeting scheduled",
      description: `New meeting has been added to the calendar`,
    });
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    const task = addTask({
      ...newTask,
      projectId: projectId,
      dueDate: new Date(newTask.dueDate)
    });
    
    setProjectTasks([...projectTasks, task]);
    
    // Update the project task counts
    const updatedProject = {
      ...project,
      tasksCount: {
        total: project.tasksCount.total + 1,
        completed: project.tasksCount.completed
      }
    };
    
    saveProjectChanges(updatedProject);
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'todo'
    });
    
    setNewTaskDialogOpen(false);
    
    toast({
      title: "Task created",
      description: "New task has been added to the project",
    });
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return {
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
  };
};

export default useProjectDetail;
