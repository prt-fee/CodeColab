
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Filter, Search, Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import { useTaskManager } from '@/hooks/useTaskManager';

const TaskItem = ({ task, onStatusChange }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    }).format(new Date(date));
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(task.id, newStatus);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>Due: {formatDate(task.dueDate)}</span>
          <span className="capitalize">{task.status.replace('-', ' ')}</span>
        </div>

        <div className="flex gap-2 justify-end">
          {task.status !== 'todo' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('todo')}>
              Move to Todo
            </Button>
          )}
          {task.status !== 'in-progress' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('in-progress')}>
              Move to In Progress
            </Button>
          )}
          {task.status !== 'completed' && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('completed')}>
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Tasks = () => {
  const { user } = useAuth();
  const { tasks, updateTask, addTask } = useTaskManager();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'todo'
  });

  const handleTaskStatusChange = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    toast({
      title: "Task updated",
      description: "Task status changed successfully",
    });
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    addTask({
      ...newTask,
      dueDate: new Date(newTask.dueDate)
    });
    
    toast({
      title: "Success",
      description: "Task created successfully",
    });
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'todo'
    });
    
    setIsNewTaskDialogOpen(false);
  };

  const filteredTasks = tasks.filter(task => {
    // Apply status filter
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all your tasks
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTask}>
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
                      <Select 
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({...newTask, priority: value})}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
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
                  <Button type="submit">Create Task</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">To Do</h2>
            <div className="space-y-4">
              {filteredTasks.filter(task => task.status === 'todo').map((task) => (
                <TaskItem key={task.id} task={task} onStatusChange={handleTaskStatusChange} />
              ))}
              {filteredTasks.filter(task => task.status === 'todo').length === 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center text-muted-foreground">
                    No todo tasks found
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">In Progress</h2>
            <div className="space-y-4">
              {filteredTasks.filter(task => task.status === 'in-progress').map((task) => (
                <TaskItem key={task.id} task={task} onStatusChange={handleTaskStatusChange} />
              ))}
              {filteredTasks.filter(task => task.status === 'in-progress').length === 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center text-muted-foreground">
                    No in-progress tasks found
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Completed</h2>
            <div className="space-y-4">
              {filteredTasks.filter(task => task.status === 'completed').map((task) => (
                <TaskItem key={task.id} task={task} onStatusChange={handleTaskStatusChange} />
              ))}
              {filteredTasks.filter(task => task.status === 'completed').length === 0 && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4 text-center text-muted-foreground">
                    No completed tasks found
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
