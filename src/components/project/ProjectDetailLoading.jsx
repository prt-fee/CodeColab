
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectDetailLoading = ({ onGoBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

const ProjectNotFound = ({ onGoBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <Button onClick={onGoBack}>Back to Dashboard</Button>
      </div>
    </div>
  );
};

export { ProjectDetailLoading, ProjectNotFound };
