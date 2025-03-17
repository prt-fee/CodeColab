
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, FileText, KanbanSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import useDashboard from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectColor, setProjectColor] = useState('blue');
  const { createProject } = useDashboard();
  const navigate = useNavigate();
  
  const handleCreateProject = () => {
    if (!projectTitle.trim()) return;
    
    const newProject = {
      title: projectTitle,
      description: projectDescription,
      color: projectColor,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    };
    
    const createdProject = createProject(newProject);
    setIsDialogOpen(false);
    setProjectTitle('');
    setProjectDescription('');
    setProjectColor('blue');
    
    // Navigate to the new project
    navigate(`/projects/${createdProject.id}`);
  };
  
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Link to="/tasks">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Task List
            </Button>
          </Link>
          
          <Link to="/projects">
            <Button variant="outline">
              <KanbanSquare className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
          
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter the details for your new project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="projectTitle">Project Name</Label>
              <Input
                id="projectTitle"
                placeholder="Enter project name"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea
                id="projectDescription"
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="projectColor">Color</Label>
              <Select value={projectColor} onValueChange={setProjectColor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleCreateProject}>Create Project</Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default DashboardHeader;
