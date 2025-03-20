
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import ProjectDeployment from '@/components/project/ProjectDeployment';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ProjectUpload = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, don't render the content
  if (!isAuthenticated) return null;

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
