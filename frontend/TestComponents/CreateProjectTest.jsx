import React, { useState } from 'react';
import { projectAPI } from '@/services/firebaseAPI';
import { toast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button"
import { auth } from "./../src/services/firebase";

const ProjectForm = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    assignees: [],
    manager: null,
    startDate: null,
    endDate: null,
    category: 'uncategorized',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectData.name.trim()) {
      setError('Project name is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newProject = await projectAPI.createProject({
        ...projectData,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [auth.currentUser?.uid]
      });

      if (newProject) {
        toast({
          title: "Success",
          description: "Project created successfully"
        });
        
        // Reset form
        setProjectData({
          name: '',
          description: '',
          dueDate: '',
          priority: 'medium'
        });
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.message || 'Failed to create project');
      toast({
        title: "Error",
        description: error || "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input 
          type="text"
          name="name"
          value={projectData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter project name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea 
          name="description"
          value={projectData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
          placeholder="Enter project description"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input 
          type="date"
          name="dueDate"
          value={projectData.dueDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select 
          name="priority"
          value={projectData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Project'}
      </Button>
    </form>
  );
};

export default ProjectForm;