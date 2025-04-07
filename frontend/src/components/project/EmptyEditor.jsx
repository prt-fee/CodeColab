
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

const EmptyEditor = ({ onNewFileClick }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border rounded-md bg-background/50">
      <div className="mb-4 p-3 rounded-full bg-primary/10">
        <Code className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No file selected</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Select a file from the sidebar to edit or create a new file to get started
      </p>
      <Button onClick={onNewFileClick} className="gap-2">
        <Code className="h-4 w-4" />
        Create New File
      </Button>
    </div>
  );
};

export default EmptyEditor;
