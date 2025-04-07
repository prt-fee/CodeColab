
import React from 'react';
import { FileText, FolderPlus, GitCommit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const FileList = ({ 
  files = [], 
  selectedFile, 
  setSelectedFile, 
  onNewFileClick, 
  onCommitClick,
  activeCollaborators = []
}) => {
  // Group files by type
  const filesByType = files.reduce((acc, file) => {
    const type = file.type || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(file);
    return acc;
  }, {});

  // Sort file types
  const fileTypes = Object.keys(filesByType).sort((a, b) => {
    const order = { 'js': 0, 'jsx': 1, 'ts': 2, 'tsx': 3, 'component': 4, 'css': 5, 'html': 6, 'other': 7 };
    return (order[a] || 99) - (order[b] || 99);
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 p-2">
        <h3 className="text-lg font-semibold">Files</h3>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewFileClick}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCommitClick}
          >
            <GitCommit className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {activeCollaborators.length > 0 && (
        <div className="mb-4 p-2 border-b">
          <p className="text-sm text-muted-foreground mb-2">Active collaborators:</p>
          <div className="flex -space-x-2">
            {activeCollaborators.map((collaborator, index) => (
              <Avatar key={collaborator.id || index} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={collaborator.avatar} />
                <AvatarFallback className="text-xs">
                  {collaborator.name ? collaborator.name.charAt(0) : `C${index}`}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        {fileTypes.map(type => (
          <div key={type} className="mb-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-1">
              {type}
            </h4>
            
            <div className="space-y-1">
              {filesByType[type].map(file => (
                <Button
                  key={file.id}
                  variant={selectedFile?.id === file.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left px-2 py-1 h-auto"
                  onClick={() => setSelectedFile(file)}
                >
                  <FileText className="h-4 w-4 mr-2 shrink-0" />
                  <span className="truncate text-sm">{file.name}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}

        {files.length === 0 && (
          <div className="px-2 py-4 text-center text-muted-foreground text-sm">
            No files yet. Click the + button to add a file.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default FileList;
