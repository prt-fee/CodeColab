
import React from 'react';
import NavBar from '@/components/NavBar';
import ProjectDeployment from '@/components/project/ProjectDeployment';

const ProjectUpload = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Project Upload & Deployment</h1>
          <p className="text-muted-foreground">
            Upload your projects and deploy them with automated CI/CD
          </p>
        </header>
        
        <ProjectDeployment />
      </div>
    </div>
  );
};

export default ProjectUpload;
