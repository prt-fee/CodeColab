
import React from 'react';
import { Button } from '@/components/ui/button';
import { Code, FileText, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EmptyEditor = ({ onNewFileClick }) => {
  const handleNewFile = () => {
    if (typeof onNewFileClick === 'function') {
      onNewFileClick();
    } else {
      toast({
        title: "Action not available",
        description: "The ability to create a new file is not available at this moment.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border rounded-md bg-background/50 h-full">
      <div className="mb-6 p-4 rounded-full bg-primary/10">
        <Code className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-2xl font-medium mb-3">No file selected</h3>
      <p className="text-muted-foreground mb-8 max-w-md">
        Select a file from the sidebar to edit or create a new file to get started with your project
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button onClick={handleNewFile} className="gap-2">
          <Plus className="h-4 w-4" />
          Create New File
        </Button>
        <Button variant="outline" onClick={() => window.open('https://docs.lovable.dev', '_blank')} className="gap-2">
          <FileText className="h-4 w-4" />
          View Documentation
        </Button>
      </div>
    </div>
  );
};

export default EmptyEditor;
