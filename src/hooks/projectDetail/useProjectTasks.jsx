
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectTasks = (projectId) => {
  const [projectTasks, setProjectTasks] = useState([]);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    dueDate: new Date(),
    priority: 'medium',
    status: 'pending'
  });

  // Load project tasks
  useEffect(() => {
    if (!projectId) return;
    
    // Get stored tasks
    const storedTasks = JSON.parse(localStorage.getItem('project_tasks') || '[]');
    
    // Filter tasks for this project
    const tasksForProject = storedTasks.filter(task => task.projectId === projectId);
    setProjectTasks(tasksForProject);
  }, [projectId]);

  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return false;
    }
    
    // Create a new task
    const task = {
      id: Date.now().toString(),
      projectId: projectId,
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      dueDate: newTask.dueDate.toISOString(),
      priority: newTask.priority,
      status: newTask.status,
      createdAt: new Date().toISOString()
    };
    
    // Get stored tasks
    const storedTasks = JSON.parse(localStorage.getItem('project_tasks') || '[]');
    
    // Add the new task
    const updatedTasks = [...storedTasks, task];
    
    // Update localStorage
    localStorage.setItem('project_tasks', JSON.stringify(updatedTasks));
    
    // Update the local state
    setProjectTasks([...projectTasks, task]);
    
    // Clear the form and close the dialog
    setNewTask({
      title: '',
      description: '',
      assignedTo: '',
      dueDate: new Date(),
      priority: 'medium',
      status: 'pending'
    });
    setNewTaskDialogOpen(false);
    
    toast({
      title: "Task created",
      description: `"${task.title}" has been added to the project`,
    });
    
    return true;
  };

  return {
    projectTasks,
    newTaskDialogOpen,
    setNewTaskDialogOpen,
    newTask,
    setNewTask,
    handleAddTask
  };
};

export default useProjectTasks;
