
import React, { useState, useRef, useEffect } from 'react';
import { useTaskManager } from '@/hooks/useTaskManager';
import { toast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import KanbanTaskDialog from '@/components/kanban/KanbanTaskDialog';
import KanbanSearch from '@/components/kanban/KanbanSearch';
import KanbanStats from '@/components/kanban/KanbanStats';
import KanbanHeader from '@/components/kanban/KanbanHeader';

const KanbanBoard = () => {
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
          <KanbanHeader 
            completionRate={completionRate} 
            openNewTaskDialog={() => setIsNewTaskDialogOpen(true)} 
          />

          {/* Dashboard Stats */}
          <KanbanStats 
            todoTasks={todoTasks} 
            inProgressTasks={inProgressTasks} 
            completedTasks={completedTasks} 
            completionRate={completionRate} 
          />

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
