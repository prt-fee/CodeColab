
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { taskAPI, listenToList } from '@/services/firebaseAPI';

const useProjectTasks = (projectId, project, saveProjectChanges) => {
  const { user } = useAuth();
  const [projectTasks, setProjectTasks] = useState([]);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'todo'
  });

  useEffect(() => {
    if (!projectId) return;

    // Set up real-time listener for tasks
    const unsubscribe = listenToList('tasks', 'projectId', projectId, (tasks) => {
      const formattedTasks = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date()
      }));
      
      setProjectTasks(formattedTasks);
    });
    
    return () => {
      unsubscribe();
    };
  }, [projectId]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const taskData = {
        ...newTask,
        projectId: projectId,
        assignedTo: user?.id,
        dueDate: new Date(newTask.dueDate).toISOString()
      };
      
      // Create task in Firebase
      const createdTask = await taskAPI.createTask(taskData);
      
      // Create activity record
      const newActivity = {
        id: Date.now().toString(),
        type: 'task',
        user: user?.name || 'You',
        target: newTask.title,
        timestamp: new Date().toISOString(),
        message: `${user?.name || 'You'} created "${newTask.title}" task`
      };
      
      // Update project with new activity
      if (project) {
        const updatedProject = {
          ...project,
          collaborationActivity: [newActivity, ...(project.collaborationActivity || [])]
        };
        
        saveProjectChanges(updatedProject);
      }
      
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
    } catch (error) {
      console.error('Error creating task:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive"
      });
    }
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
