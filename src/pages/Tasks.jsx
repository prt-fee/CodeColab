
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTaskManager } from '@/hooks/useTaskManager';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, Clock, Filter, Plus, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TaskCard = ({ task, onStatusChange }) => {
  const navigate = useNavigate();
  
  const statusColors = {
    'todo': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800'
  };
  
  const priorityColors = {
    'low': 'bg-slate-100 text-slate-800',
    'medium': 'bg-orange-100 text-orange-800',
    'high': 'bg-red-100 text-red-800',
    'urgent': 'bg-red-100 text-red-800'
  };
  
  const handleViewProject = () => {
    if (task.projectId) {
      navigate(`/projects/${task.projectId}`);
    } else {
      toast({
        title: "No project associated",
        description: "This task is not linked to any project",
        variant: "default"
      });
    }
  };
  
  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(new Date(date));
  };
  
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium">{task.title}</h3>
          <div className="flex items-center space-x-2">
            <Badge className={statusColors[task.status]}>
              {task.status.replace('-', ' ')}
            </Badge>
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {task.description || 'No description provided'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-xs text-muted-foreground">
              {formatDate(task.dueDate)}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleViewProject}>
              View Project
            </Button>
            
            {task.status !== 'completed' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange(task.id, 'completed')}
              >
                Complete
              </Button>
            )}
            
            {task.status === 'completed' && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onStatusChange(task.id, 'todo')}
              >
                Reopen
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, updateTask } = useTaskManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  const handleStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    
    toast({
      title: "Task updated",
      description: `Task marked as ${newStatus.replace('-', ' ')}`,
    });
  };
  
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });
  
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Tasks</h1>
            <p className="text-muted-foreground">
              Manage and track all your tasks
            </p>
          </div>
          
          <div className="flex gap-3">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full md:w-[250px]"
              />
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="py-4 flex flex-row items-center space-y-0">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <CardTitle className="text-md">Todo</CardTitle>
              <Badge className="ml-auto">{todoTasks.length}</Badge>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="py-4 flex flex-row items-center space-y-0">
              <Clock className="h-5 w-5 text-yellow-500 mr-2" />
              <CardTitle className="text-md">In Progress</CardTitle>
              <Badge className="ml-auto">{inProgressTasks.length}</Badge>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="py-4 flex flex-row items-center space-y-0">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <CardTitle className="text-md">Completed</CardTitle>
              <Badge className="ml-auto">{completedTasks.length}</Badge>
            </CardHeader>
          </Card>
        </div>
        
        <div className="mb-4 flex justify-between items-center">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="todo">To Do</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <select 
                className="border rounded-md py-1 px-3"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <TabsContent value="all" className="mt-6 space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-background border border-dashed rounded-md">
                  <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || priorityFilter !== 'all' 
                      ? "Try adjusting your filters" 
                      : "Create your first task to get started"}
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange} 
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="todo" className="mt-6 space-y-4">
              {todoTasks.length === 0 ? (
                <div className="text-center py-8 bg-background border border-dashed rounded-md">
                  <p className="text-muted-foreground">No to-do tasks found</p>
                </div>
              ) : (
                todoTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange} 
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="in-progress" className="mt-6 space-y-4">
              {inProgressTasks.length === 0 ? (
                <div className="text-center py-8 bg-background border border-dashed rounded-md">
                  <p className="text-muted-foreground">No in-progress tasks found</p>
                </div>
              ) : (
                inProgressTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange} 
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6 space-y-4">
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 bg-background border border-dashed rounded-md">
                  <p className="text-muted-foreground">No completed tasks found</p>
                </div>
              ) : (
                completedTasks.map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onStatusChange={handleStatusChange} 
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
