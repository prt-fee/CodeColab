
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import NavBar from '../components/navbar';
import { Button } from '../components/ui/button';
import { PlusCircle } from 'lucide-react';

const Projects = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Create your first project to get started</p>
            <Button onClick={() => {}}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div 
                key={project.id}
                className="bg-card rounded-lg border shadow-sm p-6 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                {project.description && (
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{project.members} members</span>
                  <div className="bg-secondary h-2 rounded-full w-24">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(project.tasksCount.completed / project.tasksCount.total) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
