
import React, { useState } from 'react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, ArrowRight, CheckCircle, Clock, Calendar, AlignLeft, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const TaskCard = ({ task, onMoveTask }) => {
  const navigate = useNavigate();
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'todo') return 'in-progress';
    if (currentStatus === 'in-progress') return 'completed';
    return 'todo';
  };

  const handleClick = () => {
    if (task.projectId) {
      navigate(`/projects/${task.projectId}`);
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">{task.title}</h3>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
        )}
        
        <div className="flex justify-between items-center mb-3">
          <Badge className={priorityColors[task.priority] || priorityColors.medium}>
            {task.priority}
          </Badge>
          
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMoveTask(task.id, getNextStatus(task.status));
            }}
          >
            {task.status === 'todo' && (
              <>
                <ArrowRight className="h-3 w-3 mr-1" />
                Start
              </>
            )}
            {task.status === 'in-progress' && (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </>
            )}
            {task.status === 'completed' && (
              <>
                <ArrowRight className="h-3 w-3 mr-1" />
                Reopen
              </>
            )}
          </Button>
          
          {task.projectId && (
            <div className="flex items-center">
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const TasksPage = () => {
  const { tasks, updateTask, addTask } = useTaskManager();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0]
  });

  const handleMoveTask = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
    
    toast({
      title: "Task updated",
      description: `Task moved to ${newStatus.replace('-', ' ')}`,
    });
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
    
    addTask({
      ...newTask,
      dueDate: new Date(newTask.dueDate)
    });
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0]
    });
    
    setShowAddTaskModal(false);
    
    toast({
      title: "Task created",
      description: "New task has been added",
    });
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Tasks</h1>
            <p className="text-muted-foreground">Manage and track your tasks</p>
          </div>
          <Button onClick={() => setShowAddTaskModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>To Do</CardTitle>
                  <Badge variant="outline">{todoTasks.length}</Badge>
                </div>
                <CardDescription>Tasks that need to be started</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {todoTasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No tasks to do</p>
                  </div>
                ) : (
                  todoTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task}
                      onMoveTask={handleMoveTask}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>In Progress</CardTitle>
                  <Badge variant="outline">{inProgressTasks.length}</Badge>
                </div>
                <CardDescription>Tasks currently being worked on</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {inProgressTasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No tasks in progress</p>
                  </div>
                ) : (
                  inProgressTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task}
                      onMoveTask={handleMoveTask}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Completed</CardTitle>
                  <Badge variant="outline">{completedTasks.length}</Badge>
                </div>
                <CardDescription>Tasks that have been finished</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {completedTasks.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No completed tasks</p>
                  </div>
                ) : (
                  completedTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task}
                      onMoveTask={handleMoveTask}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a new task to track</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Task Title</label>
                  <input 
                    id="title" 
                    className="w-full p-2 border rounded"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <textarea 
                    id="description" 
                    className="w-full p-2 border rounded"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="priority" className="text-sm font-medium">Priority</label>
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
                  
                  <div className="space-y-2">
                    <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
                    <input 
                      id="dueDate" 
                      type="date"
                      className="w-full p-2 border rounded"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddTaskModal(false)}
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
  );
};

export default TasksPage;
