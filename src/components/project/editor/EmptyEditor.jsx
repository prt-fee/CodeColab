
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

const EmptyEditor = ({ onNewFileClick }) => {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">Select a file to edit or create a new file</p>
      <Button onClick={onNewFileClick} variant="outline">
        <Code className="h-4 w-4 mr-2" />
        Create New File
      </Button>
    </div>
  );
};

export default EmptyEditor;
