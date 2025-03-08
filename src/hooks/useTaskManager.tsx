
import { useState, useEffect } from 'react';

// Types
export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  projectId?: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sample initial tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Create project requirements',
    description: 'Define the scope and requirements for the new project',
    status: 'completed',
    priority: 'high',
    projectId: '1',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-12'),
    dueDate: new Date('2023-05-15')
  },
  {
    id: '2',
    title: 'Design user interface',
    description: 'Create wireframes and mockups for the application',
    status: 'in-progress',
    priority: 'high',
    projectId: '1',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2023-05-14'),
    dueDate: new Date('2023-05-20')
  },
  {
    id: '3',
    title: 'Set up development environment',
    description: 'Install and configure all necessary tools and frameworks',
    status: 'todo',
    priority: 'medium',
    projectId: '1',
    createdAt: new Date('2023-05-14'),
    updatedAt: new Date('2023-05-14'),
    dueDate: new Date('2023-05-18')
  },
  {
    id: '4',
    title: 'Implement authentication',
    description: 'Create login and registration functionality',
    status: 'todo',
    priority: 'high',
    projectId: '1',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-15'),
    dueDate: new Date('2023-05-25')
  },
  {
    id: '5',
    title: 'Create database schema',
    description: 'Design and implement the database structure',
    status: 'todo',
    priority: 'medium',
    projectId: '1',
    createdAt: new Date('2023-05-16'),
    updatedAt: new Date('2023-05-16'),
    dueDate: new Date('2023-05-22')
  }
];

// Hook for managing tasks
export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, you would fetch tasks from your API
        const storedTasks = localStorage.getItem('projectify_tasks');
        if (storedTasks) {
          // Parse the stored tasks and convert date strings back to Date objects
          const parsedTasks = JSON.parse(storedTasks, (key, value) => {
            if (key === 'createdAt' || key === 'updatedAt' || key === 'dueDate') {
              return value ? new Date(value) : null;
            }
            return value;
          });
          setTasks(parsedTasks);
        } else {
          setTasks(initialTasks);
          saveTasksToStorage(initialTasks);
        }
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error('Error fetching tasks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Save tasks to localStorage
  const saveTasksToStorage = (tasks: Task[]) => {
    localStorage.setItem('projectify_tasks', JSON.stringify(tasks));
  };

  // Add a new task
  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    return newTask;
  };

  // Update an existing task
  const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          ...updates,
          updatedAt: new Date()
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // Delete a task
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  // Get tasks by status
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  // Get tasks by project
  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
    getTasksByProject
  };
};
