
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, FileText, KanbanSquare } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import NewProjectDialog from './NewProjectDialog';

const DashboardHeader = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  
  const handleCreateProject = (e) => {
    e.preventDefault();
    // Implementation will be handled by the parent component
    console.log('Create project:', newProject);
    setIsDialogOpen(false);
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
          
          <Link to="/kanban">
            <Button variant="outline">
              <KanbanSquare className="mr-2 h-4 w-4" />
              Kanban Board
            </Button>
          </Link>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <NewProjectDialog 
              isOpen={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              newProject={newProject}
              setNewProject={setNewProject}
              onCreateProject={handleCreateProject}
            />
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
