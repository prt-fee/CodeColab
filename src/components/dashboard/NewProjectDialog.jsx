
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const NewProjectDialog = ({ 
  isOpen, 
  onOpenChange, 
  newProject = { name: '', description: '' }, 
  setNewProject = () => {}, 
  onCreateProject = () => {} 
}) => {
  // Provide default values to prevent undefined errors
  const handleNameChange = (e) => {
    setNewProject({ ...newProject, name: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    setNewProject({ ...newProject, description: e.target.value });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogDescription>
          Enter the details for your new project.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onCreateProject}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={newProject?.name || ''}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              placeholder="Enter project description"
              value={newProject?.description || ''}
              onChange={handleDescriptionChange}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Create Project</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewProjectDialog;
