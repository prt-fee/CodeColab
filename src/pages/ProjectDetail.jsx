
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CalendarDays, Users, File } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTaskManager } from '@/hooks/useTaskManager';
import { toast } from '@/hooks/use-toast';

// Mock projects data for fallback
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
    ],
    tasksCount: {
      total: 12,
      completed: 8
    },
    files: [
      { id: '1', name: 'Project Brief.pdf', type: 'pdf' },
      { id: '2', name: 'Design Mockups.png', type: 'image' },
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
      { id: '3', name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    tasksCount: {
      total: 20,
      completed: 5
    },
    files: [
      { id: '1', name: 'App Requirements.docx', type: 'document' },
    ]
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Plan and execute Q3 marketing campaign',
    color: 'orange',
    dueDate: new Date('2023-07-10'),
    members: [
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' },
    ],
    tasksCount: {
      total: 8,
      completed: 2
    },
    files: []
  }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTaskManager();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projectTasks, setProjectTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium'
  });
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Try to load from localStorage
      const savedProjects = localStorage.getItem('user_projects');
      if (savedProjects) {
        try {
          const projects = JSON.parse(savedProjects);
          const foundProject = projects.find(p => p.id === id);
          if (foundProject) {
            // Ensure dates are properly parsed
            if (foundProject.dueDate) {
              foundProject.dueDate = new Date(foundProject.dueDate);
            }
            
            // Initialize members array if it's a number
            if (typeof foundProject.members === 'number') {
              const memberCount = foundProject.members;
              foundProject.members = Array.from({ length: memberCount }, (_, i) => ({
                id: (i + 1).toString(),
                name: `Team Member ${i + 1}`,
                email: `member${i + 1}@example.com`,
                avatar: `https://i.pravatar.cc/150?img=${i + 1}`
              }));
            }
            
            setProject(foundProject);
            const filteredTasks = tasks.filter(task => task.projectId === id);
            setProjectTasks(filteredTasks);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse saved projects:', e);
        }
      }
      
      // Fallback to mock data
      const foundProject = mockProjects.find(p => p.id === id);
      if (foundProject) {
        setProject(foundProject);
        const filteredTasks = tasks.filter(task => task.projectId === id);
        setProjectTasks(filteredTasks);
      } else {
        toast({
          title: "Project not found",
          description: "We couldn't find the project you're looking for",
          variant: "destructive"
        });
        
        // Navigate back to projects page
        navigate('/projects');
      }
      
      setIsLoading(false);
    };
    
    loadProject();
  }, [id, tasks, navigate]);

  const handleGoBack = () => {
    navigate('/projects');
  };

  const handleAddTask = () => {
    if (!newTask.title) {
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
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Due in 1 week
    });
    
    setProjectTasks([...projectTasks, task]);
    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium'
    });
    
    setIsAddTaskModalOpen(false);
    
    toast({
      title: "Task created",
      description: "New task has been added to the project"
    });
  };

  const handleUpdateTaskStatus = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    
    // Update local state
    const updatedTasks = projectTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    
    setProjectTasks(updatedTasks);
    
    toast({
      title: "Task updated",
      description: `Task status changed to ${newStatus.replace('-', ' ')}`
    });
  };

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

  const formatDate = (date) => {
    if (!date) return 'No date set';
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const inProgressTasks = projectTasks.filter(task => task.status === 'in-progress');
  const completedTasks = projectTasks.filter(task => task.status === 'completed');

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
              {project.members && project.members.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {project.members && project.members.length > 3 && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs border-2 border-background">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Tasks</CardTitle>
              <div className="text-2xl font-bold">
                {projectTasks.length} 
                <span className="text-sm text-muted-foreground font-normal ml-1">total</span>
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Completion</CardTitle>
              <div className="text-2xl font-bold">
                {projectTasks.length > 0 
                  ? Math.round((completedTasks.length / projectTasks.length) * 100) 
                  : 0}%
                <span className="text-sm text-muted-foreground font-normal ml-1">complete</span>
              </div>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Team</CardTitle>
              <div className="text-2xl font-bold">
                {typeof project.members === 'number' ? project.members : project.members.length}
                <span className="text-sm text-muted-foreground font-normal ml-1">members</span>
              </div>
            </CardHeader>
          </Card>
        </div>
        
        <Tabs defaultValue="tasks" className="mb-8">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="mt-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Project Tasks</h2>
              <Button onClick={() => setIsAddTaskModalOpen(true)}>Add Task</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  To Do
                  <Badge variant="outline">{todoTasks.length}</Badge>
                </h3>
                
                {todoTasks.length === 0 ? (
                  <div className="bg-background border border-dashed rounded-md p-4 text-center text-muted-foreground">
                    No tasks to do
                  </div>
                ) : (
                  todoTasks.map(task => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex justify-between mt-2">
                          <Badge variant="outline" className={
                            task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {task.priority}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateTaskStatus(task.id, 'in-progress')}
                          >
                            Start
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  In Progress
                  <Badge variant="outline">{inProgressTasks.length}</Badge>
                </h3>
                
                {inProgressTasks.length === 0 ? (
                  <div className="bg-background border border-dashed rounded-md p-4 text-center text-muted-foreground">
                    No tasks in progress
                  </div>
                ) : (
                  inProgressTasks.map(task => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex justify-between mt-2">
                          <Badge variant="outline" className={
                            task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {task.priority}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                          >
                            Complete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  Completed
                  <Badge variant="outline">{completedTasks.length}</Badge>
                </h3>
                
                {completedTasks.length === 0 ? (
                  <div className="bg-background border border-dashed rounded-md p-4 text-center text-muted-foreground">
                    No completed tasks
                  </div>
                ) : (
                  completedTasks.map(task => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex justify-between mt-2">
                          <Badge variant="outline" className={
                            task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-blue-800'
                          }>
                            {task.priority}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateTaskStatus(task.id, 'todo')}
                          >
                            Reopen
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="mt-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Project Files</h2>
              <Button>Upload File</Button>
            </div>
            
            {project.files && project.files.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.files.map(file => (
                  <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-3">
                      <File className="h-8 w-8 text-primary" />
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <p className="text-xs text-muted-foreground uppercase">{file.type}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-background border border-dashed rounded-md">
                <File className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-1">No files yet</h3>
                <p className="text-muted-foreground mb-4">Upload project files to keep them organized</p>
                <Button>Upload File</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="team" className="mt-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Project Team</h2>
              <Button>Add Member</Button>
            </div>
            
            {project.members && project.members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.members.map(member => (
                  <Card key={member.id}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-1">No team members yet</h3>
                <p className="text-muted-foreground mb-4">Add team members to collaborate on this project</p>
                <Button>Add Member</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {isAddTaskModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
                <CardDescription>Create a new task for this project</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="font-medium">Task Title</label>
                    <input 
                      id="title" 
                      className="w-full p-2 border rounded"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Enter task title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="font-medium">Description</label>
                    <textarea 
                      id="description" 
                      className="w-full p-2 border rounded"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="priority" className="font-medium">Priority</label>
                    <select 
                      id="priority" 
                      className="w-full p-2 border rounded"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddTaskModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleAddTask}>
                      Add Task
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
