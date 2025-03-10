
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Users, Calendar, PieChart, FilePlus, FolderPlus, Save, Code, BarChart, Upload, GitBranch, GitPullRequest } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskManager } from '@/hooks/useTaskManager';
import NavBar from '@/components/NavBar';
import { toast } from '@/hooks/use-toast';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/markdown/markdown';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Mock project data (you would fetch this from your API)
const mockProjects = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with a modern look and feel',
    color: 'blue',
    dueDate: new Date('2023-06-30'),
    members: [
      { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=4' }
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
      { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' }
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
      { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
      { id: '4', name: 'Sarah Williams', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', name: 'Alex Brown', avatar: 'https://i.pravatar.cc/150?img=5' }
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

const CodeEditor = ({ file, onSave }) => {
  const [content, setContent] = useState(file?.content || '');
  const [theme, setTheme] = useState('eclipse');

  const getLanguage = (fileType) => {
    switch (fileType) {
      case 'js': return 'javascript';
      case 'css': return 'css';
      case 'html': return 'htmlmixed';
      case 'md': return 'markdown';
      default: return 'javascript';
    }
  };

  const handleSave = () => {
    onSave(file.id, content);
    toast({
      title: "Saved",
      description: `${file.name} has been saved`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{file?.name}</h3>
        <div className="flex gap-2">
          <select 
            className="px-2 py-1 text-sm border rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="eclipse">Light Theme</option>
            <option value="material">Dark Theme</option>
          </select>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={content}
          options={{
            mode: getLanguage(file?.type),
            theme: theme,
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            extraKeys: {"Ctrl-Space": "autocomplete"},
            indentWithTabs: true,
            indentUnit: 2,
          }}
          onBeforeChange={(editor, data, value) => {
            setContent(value);
          }}
        />
      </div>
    </div>
  );
};

const MeetingItem = ({ meeting }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{meeting.title}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {meeting.duration} min
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {formatDate(meeting.date)}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{meeting.attendees.length} attendees</span>
        </div>
      </CardContent>
    </Card>
  );
};

const CommitItem = ({ commit }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="flex items-start p-3 border-b last:border-b-0">
      <div className="flex-1">
        <p className="font-medium break-all">{commit.message}</p>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span className="mr-3">{commit.author}</span>
          <span>{formatDate(commit.date)}</span>
        </div>
      </div>
    </div>
  );
};

const PullRequestItem = ({ pr }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="flex items-start p-3 border-b last:border-b-0">
      <div className="flex-1">
        <p className="font-medium">{pr.title}</p>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span className="mr-3">by {pr.author}</span>
          <span className={`px-2 py-0.5 rounded-full ${
            pr.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {pr.status}
          </span>
          <span className="ml-3">{formatDate(pr.date)}</span>
        </div>
      </div>
    </div>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { tasks, getTasksByProject, addTask } = useTaskManager();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
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
    // Simulate loading data
    const timer = setTimeout(() => {
      const foundProject = mockProjects.find(p => p.id === id);
      if (foundProject) {
        setProject(foundProject);
        setSelectedFile(foundProject.files[0]);
        
        // Get tasks for this project
        const filteredTasks = tasks.filter(task => task.projectId === id);
        setProjectTasks(filteredTasks);
      }
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id, tasks]);

  const handleSaveFile = (fileId, newContent) => {
    const updatedFiles = project.files.map(file => 
      file.id === fileId ? { ...file, content: newContent } : file
    );
    
    setProject({
      ...project,
      files: updatedFiles
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
      name: newFileName,
      type: newFileType,
      content: ''
    };
    
    const updatedFiles = [...project.files, newFile];
    setProject({
      ...project,
      files: updatedFiles
    });
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
    setProject({
      ...project,
      commits: updatedCommits
    });
    
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
    
    const newMeetingData = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: dateTime,
      duration: parseInt(newMeeting.duration),
      attendees: project.members.slice(0, 2).map(member => member.name)
    };
    
    const updatedMeetings = [...project.meetings, newMeetingData];
    setProject({
      ...project,
      meetings: updatedMeetings
    });

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
      projectId: id,
      dueDate: new Date(newTask.dueDate)
    });
    
    setProjectTasks([...projectTasks, task]);
    
    // Update project task count
    setProject({
      ...project,
      tasksCount: {
        total: project.tasksCount.total + 1,
        completed: project.tasksCount.completed
      }
    });
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate task status counts for charts
  const statusCounts = {
    todo: projectTasks.filter(task => task.status === 'todo').length,
    inProgress: projectTasks.filter(task => task.status === 'in-progress').length,
    completed: projectTasks.filter(task => task.status === 'completed').length
  };

  // Calculate priority counts for charts
  const priorityCounts = {
    low: projectTasks.filter(task => task.priority === 'low').length,
    medium: projectTasks.filter(task => task.priority === 'medium').length,
    high: projectTasks.filter(task => task.priority === 'high').length
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex space-x-2">
            <Dialog open={newFileDialogOpen} onOpenChange={setNewFileDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FilePlus className="h-4 w-4 mr-2" />
                  New File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New File</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="filename">File Name</Label>
                    <Input
                      id="filename"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Enter file name with extension (e.g. main.js)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filetype">File Type</Label>
                    <select
                      id="filetype"
                      value={newFileType}
                      onChange={(e) => setNewFileType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="js">JavaScript (.js)</option>
                      <option value="html">HTML (.html)</option>
                      <option value="css">CSS (.css)</option>
                      <option value="md">Markdown (.md)</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddFile}>Create File</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={newMeetingDialogOpen} onOpenChange={setNewMeetingDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule a Meeting</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Meeting Title</Label>
                    <Input
                      id="title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                      placeholder="Enter meeting title"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newMeeting.date}
                        onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={newMeeting.time}
                        onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newMeeting.duration}
                      onChange={(e) => setNewMeeting({...newMeeting, duration: e.target.value})}
                      min="15"
                      step="15"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddMeeting}>Schedule Meeting</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="code" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="commits">Commits</TabsTrigger>
            <TabsTrigger value="pulls">Pull Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Files</CardTitle>
                    <div className="flex justify-between items-center">
                      <Button variant="ghost" size="sm" onClick={() => setNewFileDialogOpen(true)}>
                        <FilePlus className="h-4 w-4 mr-2" />
                        New
                      </Button>
                      
                      <Dialog open={newCommitDialogOpen} onOpenChange={setNewCommitDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <GitBranch className="h-4 w-4 mr-2" />
                            Commit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Commit Changes</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="message">Commit Message</Label>
                              <Textarea
                                id="message"
                                value={commitMessage}
                                onChange={(e) => setCommitMessage(e.target.value)}
                                placeholder="Describe your changes"
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddCommit}>Commit Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {project.files.map(file => (
                        <li 
                          key={file.id}
                          className={`p-2 cursor-pointer rounded hover:bg-accent ${selectedFile?.id === file.id ? 'bg-accent' : ''}`}
                          onClick={() => setSelectedFile(file)}
                        >
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            <span>{file.name}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Code Editor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedFile ? (
                      <CodeEditor file={selectedFile} onSave={handleSaveFile} />
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Select a file to edit</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tasks</CardTitle>
                  <CardDescription>
                    Manage tasks for this project
                  </CardDescription>
                </div>
                <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Task</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                          id="title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          placeholder="Enter task title"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          placeholder="Describe your task"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="priority">Priority</Label>
                          <select
                            id="priority"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddTask}>Create Task</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {projectTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No tasks for this project yet</p>
                    <Button onClick={() => setNewTaskDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Task
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium mb-3">To Do</h3>
                      <div className="space-y-3">
                        {projectTasks.filter(task => task.status === 'todo').map(task => (
                          <Card key={task.id} className="p-3">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex justify-between mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </Card>
                        ))}
                        {projectTasks.filter(task => task.status === 'todo').length === 0 && (
                          <div className="text-center p-4 border rounded-md text-muted-foreground">
                            No tasks
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">In Progress</h3>
                      <div className="space-y-3">
                        {projectTasks.filter(task => task.status === 'in-progress').map(task => (
                          <Card key={task.id} className="p-3">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex justify-between mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </Card>
                        ))}
                        {projectTasks.filter(task => task.status === 'in-progress').length === 0 && (
                          <div className="text-center p-4 border rounded-md text-muted-foreground">
                            No tasks
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Completed</h3>
                      <div className="space-y-3">
                        {projectTasks.filter(task => task.status === 'completed').map(task => (
                          <Card key={task.id} className="p-3">
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex justify-between mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>
                          </Card>
                        ))}
                        {projectTasks.filter(task => task.status === 'completed').length === 0 && (
                          <div className="text-center p-4 border rounded-md text-muted-foreground">
                            No tasks
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="meetings" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Meetings</CardTitle>
                  <CardDescription>
                    Upcoming meetings for this project
                  </CardDescription>
                </div>
                <Button onClick={() => setNewMeetingDialogOpen(true)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardHeader>
              <CardContent>
                {project.meetings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No meetings scheduled</p>
                    <Button onClick={() => setNewMeetingDialogOpen(true)}>
                      Schedule a Meeting
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {project.meetings.map(meeting => (
                      <MeetingItem key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commits" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Commit History</CardTitle>
                  <CardDescription>
                    Track changes to your project files
                  </CardDescription>
                </div>
                <Button onClick={() => setNewCommitDialogOpen(true)}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  New Commit
                </Button>
              </CardHeader>
              <CardContent>
                {!project.commits || project.commits.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No commits yet</p>
                    <Button onClick={() => setNewCommitDialogOpen(true)}>
                      Make Your First Commit
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden divide-y">
                    {project.commits.map(commit => (
                      <CommitItem key={commit.id} commit={commit} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pulls" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Pull Requests</CardTitle>
                  <CardDescription>
                    Review and merge code changes
                  </CardDescription>
                </div>
                <Button>
                  <GitPullRequest className="h-4 w-4 mr-2" />
                  New PR
                </Button>
              </CardHeader>
              <CardContent>
                {!project.pullRequests || project.pullRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No pull requests yet</p>
                    <Button>
                      Create Pull Request
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md overflow-hidden divide-y">
                    {project.pullRequests.map(pr => (
                      <PullRequestItem key={pr.id} pr={pr} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    {projectTasks.length > 0 ? (
                      <div className="w-full h-full">
                        <div className="flex justify-around h-full items-end">
                          <div className="flex flex-col items-center">
                            <div className="bg-blue-500 w-16 rounded-t-md" style={{ height: `${(statusCounts.todo / Math.max(projectTasks.length, 1)) * 200}px` }}></div>
                            <span className="mt-2 text-sm">Todo ({statusCounts.todo})</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-yellow-500 w-16 rounded-t-md" style={{ height: `${(statusCounts.inProgress / Math.max(projectTasks.length, 1)) * 200}px` }}></div>
                            <span className="mt-2 text-sm">In Progress ({statusCounts.inProgress})</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="bg-green-500 w-16 rounded-t-md" style={{ height: `${(statusCounts.completed / Math.max(projectTasks.length, 1)) * 200}px` }}></div>
                            <span className="mt-2 text-sm">Completed ({statusCounts.completed})</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No task data available</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Task Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    {projectTasks.length > 0 ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          {/* Simple pie chart rendering */}
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Low priority slice */}
                            <circle 
                              r="25" cx="50" cy="50" 
                              fill="transparent"
                              stroke="rgb(59, 130, 246)" 
                              strokeWidth="50" 
                              strokeDasharray={`${(priorityCounts.low / Math.max(projectTasks.length, 1)) * 157} 157`} 
                              transform="rotate(-90) translate(-100, 0)" 
                            />
                            {/* Medium priority slice */}
                            <circle 
                              r="25" cx="50" cy="50" 
                              fill="transparent"
                              stroke="rgb(234, 179, 8)" 
                              strokeWidth="50" 
                              strokeDasharray={`${(priorityCounts.medium / Math.max(projectTasks.length, 1)) * 157} 157`} 
                              strokeDashoffset={`${-1 * (priorityCounts.low / Math.max(projectTasks.length, 1)) * 157}`}
                              transform="rotate(-90) translate(-100, 0)" 
                            />
                            {/* High priority slice */}
                            <circle 
                              r="25" cx="50" cy="50" 
                              fill="transparent"
                              stroke="rgb(239, 68, 68)" 
                              strokeWidth="50" 
                              strokeDasharray={`${(priorityCounts.high / Math.max(projectTasks.length, 1)) * 157} 157`} 
                              strokeDashoffset={`${-1 * ((priorityCounts.low + priorityCounts.medium) / Math.max(projectTasks.length, 1)) * 157}`}
                              transform="rotate(-90) translate(-100, 0)" 
                            />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No priority data available</p>
                    )}
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm">Low ({priorityCounts.low})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm">Medium ({priorityCounts.medium})</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm">High ({priorityCounts.high})</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Project Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Overall Progress</span>
                      <span className="text-sm font-medium">
                        {project.tasksCount.total > 0 
                          ? Math.round((project.tasksCount.completed / project.tasksCount.total) * 100) 
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${project.tasksCount.total > 0 ? (project.tasksCount.completed / project.tasksCount.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div>Started: {new Date(new Date().setDate(new Date().getDate() - 14)).toLocaleDateString()}</div>
                    <div>Due: {project.dueDate.toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  People working on this project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.members.map(member => (
                    <div key={member.id} className="flex items-center p-3 border rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-accent overflow-hidden mr-3">
                        <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-xs text-muted-foreground">Team Member</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;
