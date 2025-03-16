
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectTasks = (project) => {
  const [projectTasks, setProjectTasks] = useState([]);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo'
  });

  // Load tasks from project
  useEffect(() => {
    if (project && project.tasks) {
      setProjectTasks(project.tasks);
    } else {
      setProjectTasks([]);
    }
  }, [project]);

  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    // Create task object
    const taskToAdd = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      status: newTask.status || 'todo',
      createdAt: new Date().toISOString(),
      assignee: null,
      comments: []
    };
    
    // In a real app, this would be an API call
    // For now, update in localStorage
    try {
      const savedProjects = localStorage.getItem('user_projects');
      
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const projectIndex = projects.findIndex(p => p.id === project.id);
        
        if (projectIndex !== -1) {
          const updatedProject = { ...projects[projectIndex] };
          
          if (!updatedProject.tasks) {
            updatedProject.tasks = [];
          }
          
          updatedProject.tasks.push(taskToAdd);
          projects[projectIndex] = updatedProject;
          
          localStorage.setItem('user_projects', JSON.stringify(projects));
          
          // Update local state
          setProjectTasks([...projectTasks, taskToAdd]);
          
          // Reset form
          setNewTask({
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
            status: 'todo'
          });
          
          setNewTaskDialogOpen(false);
          
          toast({
            title: "Task created",
            description: `${taskToAdd.title} has been created`
          });
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
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
