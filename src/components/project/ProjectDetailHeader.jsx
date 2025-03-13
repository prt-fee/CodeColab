
import React from 'react';
import { Button } from '@/components/ui/button';

const ProjectDetailHeader = ({ project, onGoBack, onNewFileClick, onScheduleMeetingClick }) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={onGoBack}>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mb-6">
        <Button variant="outline" onClick={onNewFileClick}>
          New File
        </Button>
        <Button onClick={onScheduleMeetingClick}>
          Schedule Meeting
        </Button>
      </div>
    </>
  );
};

export default ProjectDetailHeader;
