
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskManager } from '@/hooks/useTaskManager';
import { Plus, ArrowLeft, Filter, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import KanbanSearch from '@/components/kanban/KanbanSearch';
import KanbanTaskDialog from '@/components/kanban/KanbanTaskDialog';

const KanbanBoard = () => {
  const navigate = useNavigate();
  const { tasks, addTask, updateTask } = useTaskManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('all');
  const draggedTask = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // New task state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'todo'
  });

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Filter tasks based on search term and priority
  const filteredTasks = tasks.filter(task => {
    // Filter by search term
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by priority
    if (filterPriority !== 'all' && task.priority !== filterPriority) {
      return false;
    }
    
    return true;
  });

  // Get tasks by status
  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  // Handle drag start
  const handleDragStart = (task) => {
    draggedTask.current = task;
    setIsDragging(true);
    
    // Add visual feedback for dragging
    document.body.classList.add('dragging');
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.classList.remove('dragging');
  };

  // Handle drop of task to a new column
  const handleDrop = (status) => {
    if (draggedTask.current && draggedTask.current.status !== status) {
      const oldStatus = draggedTask.current.status;
      updateTask(draggedTask.current.id, { status });
      
      // Show appropriate toast notification based on the new status
      if (status === 'completed') {
        toast({
          title: '🎉 Task completed!',
          description: `"${draggedTask.current.title}" has been marked as completed`,
        });
      } else if (status === 'in-progress' && oldStatus === 'todo') {
        toast({
          title: '🚀 Task started',
          description: `"${draggedTask.current.title}" is now in progress`,
        });
      } else {
        toast({
          title: 'Task updated',
          description: `Task moved to ${status.replace('-', ' ')}`,
        });
      }
    }
    draggedTask.current = null;
    handleDragEnd();
  };

  // Handle create new task
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

  // Clean up any lingering classes on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('dragging');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold">Kanban Board</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                {completionRate}% Complete
              </Badge>
              <Button onClick={() => setIsNewTaskDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 shadow-sm">
              <h3 className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-wider">To Do</h3>
              <p className="text-2xl font-bold">{todoTasks.length}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 shadow-sm">
              <h3 className="text-amber-600 dark:text-amber-400 font-medium text-sm uppercase tracking-wider">In Progress</h3>
              <p className="text-2xl font-bold">{inProgressTasks.length}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 shadow-sm">
              <h3 className="text-green-600 dark:text-green-400 font-medium text-sm uppercase tracking-wider">Completed</h3>
              <p className="text-2xl font-bold">{completedTasks.length}</p>
            </div>
          </div>

          {/* Filters */}
          <KanbanSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
          />

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6" 
               style={{ opacity: isDragging ? 0.7 : 1 }}>
            <KanbanColumn 
              title="To Do" 
              tasks={todoTasks} 
              status="todo"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
            
            <KanbanColumn 
              title="In Progress" 
              tasks={inProgressTasks} 
              status="in-progress"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
            
            <KanbanColumn 
              title="Completed" 
              tasks={completedTasks} 
              status="completed"
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          </div>
        </div>

        {/* New Task Dialog */}
        <KanbanTaskDialog 
          isOpen={isNewTaskDialogOpen}
          setIsOpen={setIsNewTaskDialogOpen}
          newTask={newTask}
          setNewTask={setNewTask}
          handleCreateTask={handleCreateTask}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
