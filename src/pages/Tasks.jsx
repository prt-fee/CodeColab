
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';
import { toast } from '@/hooks/use-toast';
import { useTaskManager } from '@/hooks/useTaskManager';
import TaskColumn from '@/components/tasks/TaskColumn';
import TaskFilters from '@/components/tasks/TaskFilters';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';

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

  // Group tasks by status
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

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
          <TaskFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
          
          <CreateTaskDialog
            isOpen={isNewTaskDialogOpen}
            setIsOpen={setIsNewTaskDialogOpen}
            newTask={newTask}
            setNewTask={setNewTask}
            handleCreateTask={handleCreateTask}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn 
            title="To Do" 
            tasks={todoTasks} 
            onStatusChange={handleTaskStatusChange} 
          />
          
          <TaskColumn 
            title="In Progress" 
            tasks={inProgressTasks} 
            onStatusChange={handleTaskStatusChange} 
          />
          
          <TaskColumn 
            title="Completed" 
            tasks={completedTasks} 
            onStatusChange={handleTaskStatusChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
