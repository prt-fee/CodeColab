
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

// Get mock projects from localStorage or use defaults
const getMockProjects = () => {
  const mockProjects = [
    {
      id: '1',
      title: 'Website Redesign',
      description: 'Redesign the company website with a modern look and feel',
      color: 'blue',
      dueDate: new Date('2023-06-30'),
      members: [
        { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' }
      ],
      files: [
        { id: '1', name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Project Site</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>', createdAt: new Date().toISOString(), lastEdited: new Date().toISOString() },
        { id: '2', name: 'styles.css', type: 'css', content: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}', createdAt: new Date().toISOString(), lastEdited: new Date().toISOString() }
      ],
      meetings: [
        { id: '1', title: 'Kickoff Meeting', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), duration: 60, attendees: ['John Doe', 'Jane Smith'] }
      ],
      commits: [
        { id: '1', message: 'Initial commit', author: 'John Doe', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
      ],
      collaborationActivity: [
        { id: '1', type: 'commit', user: 'John Doe', target: 'main', timestamp: new Date().toISOString(), message: 'John Doe committed "Initial commit"' }
      ],
      tasksCount: {
        total: 12,
        completed: 8
      }
    },
    {
      id: '2',
      title: 'Mobile App Development',
      description: 'Create a new mobile app for customer engagement',
      color: 'green',
      dueDate: new Date('2023-08-15'),
      members: [
        { id: '1', name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: '3', name: 'Mark Johnson', email: 'mark@example.com', avatar: 'https://i.pravatar.cc/150?img=3' }
      ],
      files: [
        { id: '1', name: 'App.js', type: 'js', content: 'import React from "react";\n\nfunction App() {\n  return <div>Hello World</div>;\n}\n\nexport default App;', createdAt: new Date().toISOString(), lastEdited: new Date().toISOString() }
      ],
      meetings: [
        { id: '1', title: 'Sprint Planning', date: new Date(Date.now() + 24 * 60 * 60 * 1000), duration: 45, attendees: ['John Doe', 'Mark Johnson'] }
      ],
      commits: [],
      collaborationActivity: [],
      tasksCount: {
        total: 20,
        completed: 5
      }
    },
    {
      id: '3',
      title: 'Marketing Campaign',
      description: 'Plan and execute Q3 marketing campaign',
      color: 'orange',
      dueDate: new Date('2023-07-10'),
      members: [
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=2' },
        { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=4' }
      ],
      files: [],
      meetings: [],
      commits: [],
      collaborationActivity: [],
      tasksCount: {
        total: 8,
        completed: 2
      }
    }
  ];
  
  return mockProjects;
};

const useProjectData = (projectId) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProject = () => {
      // First try to load from localStorage
      setIsLoading(true);
      const savedProjects = localStorage.getItem('user_projects');
      
      if (savedProjects) {
        try {
          const projects = JSON.parse(savedProjects);
          if (Array.isArray(projects)) {
            const foundProject = projects.find(p => p.id === projectId);
            if (foundProject) {
              // Ensure dates are properly parsed
              if (foundProject.dueDate) {
                foundProject.dueDate = new Date(foundProject.dueDate);
              }
              if (foundProject.meetings) {
                foundProject.meetings.forEach(m => {
                  if (m.date) m.date = new Date(m.date);
                });
              }
              if (foundProject.commits) {
                foundProject.commits.forEach(c => {
                  if (c.date) c.date = new Date(c.date);
                });
              }
              if (foundProject.pullRequests) {
                foundProject.pullRequests.forEach(pr => {
                  if (pr.date) pr.date = new Date(pr.date);
                });
              }
              
              // Initialize members array if it's a number instead
              if (typeof foundProject.members === 'number') {
                foundProject.members = Array.from({ length: foundProject.members }, (_, i) => ({
                  id: (i + 1).toString(),
                  name: `Team Member ${i + 1}`,
                  email: `member${i + 1}@example.com`,
                  avatar: `https://i.pravatar.cc/150?img=${20 + i}`
                }));
              }
              
              // Set default arrays if missing
              if (!foundProject.files) foundProject.files = [];
              if (!foundProject.meetings) foundProject.meetings = [];
              if (!foundProject.commits) foundProject.commits = [];
              if (!foundProject.pullRequests) foundProject.pullRequests = [];
              if (!foundProject.collaborators) foundProject.collaborators = [];
              if (!foundProject.collaborationActivity) foundProject.collaborationActivity = [];
              
              setProject(foundProject);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.error('Failed to parse saved projects:', e);
        }
      }

      // If no matching project found in localStorage, check mock projects
      const mockProjects = getMockProjects();
      const foundMockProject = mockProjects.find(p => p.id === projectId);
      
      if (foundMockProject) {
        // Save mock projects to localStorage
        if (!savedProjects) {
          localStorage.setItem('user_projects', JSON.stringify(mockProjects));
        }
        setProject(foundMockProject);
      } else {
        // No project found anywhere - handle missing project
        toast({
          title: "Project not found",
          description: "The requested project could not be found",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    };
    
    // Add a slight delay to simulate loading for better UX
    const timer = setTimeout(loadProject, 500);
    return () => clearTimeout(timer);
  }, [projectId]);

  // Save project changes to localStorage
  const saveProjectChanges = (updatedProject) => {
    if (!updatedProject) {
      toast({
        title: "Error",
        description: "Cannot save null project data",
        variant: "destructive"
      });
      return;
    }
    
    setProject(updatedProject);
    
    // Update in localStorage
    const savedProjects = localStorage.getItem('user_projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects)) {
          const updatedProjects = projects.map(p => 
            p.id === projectId ? updatedProject : p
          );
          localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
          
          toast({
            title: "Project saved",
            description: "Your changes have been saved successfully"
          });
        }
      } catch (e) {
        console.error('Failed to update project in localStorage:', e);
        toast({
          title: "Error",
          description: "Failed to save project data",
          variant: "destructive"
        });
      }
    } else {
      // If no projects exist yet, create a new array with this project
      localStorage.setItem('user_projects', JSON.stringify([updatedProject]));
    }
  };
  
  // Delete project from localStorage
  const deleteProject = (id) => {
    // Remove from localStorage
    const savedProjects = localStorage.getItem('user_projects');
    if (savedProjects) {
      try {
        const projects = JSON.parse(savedProjects);
        if (Array.isArray(projects)) {
          const filteredProjects = projects.filter(p => p.id !== id);
          localStorage.setItem('user_projects', JSON.stringify(filteredProjects));
          
          toast({
            title: "Project deleted",
            description: "The project has been permanently deleted"
          });
        }
      } catch (e) {
        console.error('Failed to delete project from localStorage:', e);
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive"
        });
      }
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return {
    project,
    isLoading,
    saveProjectChanges,
    deleteProject,
    handleGoBack
  };
};

export default useProjectData;
