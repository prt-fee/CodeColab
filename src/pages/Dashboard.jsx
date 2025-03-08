
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectAPI, taskAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Plus } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import TaskCard from '@/components/TaskCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { 
    data: projects = [], 
    isLoading: isLoadingProjects,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ['projects'],
    queryFn: projectAPI.getProjects
  });
  
  const { 
    data: recentTasks = [], 
    isLoading: isLoadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: () => taskAPI.getTasks()
  });

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!newProject.name) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await projectAPI.createProject(newProject);
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      setNewProject({ name: '', description: '' });
      setIsDialogOpen(false);
      refetchProjects();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    }
  };

  if (isLoadingProjects && isLoadingTasks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || 'User'}!
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                You have {projects.length} active {projects.length === 1 ? 'project' : 'projects'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>
                Total tasks across all projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{recentTasks.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
              <CardDescription>
                Tasks due in the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {recentTasks.filter(task => {
                  const dueDate = new Date(task.dueDate);
                  const today = new Date();
                  const nextWeek = new Date();
                  nextWeek.setDate(today.getDate() + 7);
                  return dueDate >= today && dueDate <= nextWeek;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Projects</h2>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Add the details for your new project
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input 
                        id="name" 
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Describe your project"
                        rows={4}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Project</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {projects.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">You don't have any projects yet</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} onUpdate={refetchProjects} />
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-muted-foreground">No tasks available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentTasks.slice(0, 5).map((task) => (
                <TaskCard key={task._id} task={task} onUpdate={refetchTasks} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
