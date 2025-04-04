
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Code, FileUp, FolderPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const FileList = ({ 
  files,
  selectedFile,
  setSelectedFile,
  onNewFileClick,
  onCommitClick,
  activeCollaborators
}) => {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingFile(true);
    
    // Simulate file reading
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      
      // Create a new file object
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.split('.').pop().toLowerCase(),
        content: content,
        createdAt: new Date().toISOString()
      };
      
      // Add to files array
      const updatedFiles = [...files, newFile];
      
      // Select the new file
      setSelectedFile(newFile);
      
      setUploadingFile(false);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded and added to the project`,
      });
    };
    
    reader.onerror = () => {
      setUploadingFile(false);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    };
    
    reader.readAsText(file);
  };
  
  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  // Group files by folder
  const filesByFolder = files.reduce((acc, file) => {
    const parts = file.name.split('/');
    if (parts.length > 1) {
      // This file is in a folder
      const folderPath = parts.slice(0, -1).join('/');
      if (!acc[folderPath]) {
        acc[folderPath] = [];
      }
      acc[folderPath].push(file);
    } else {
      // This is a root file
      if (!acc['root']) {
        acc['root'] = [];
      }
      acc['root'].push(file);
    }
    return acc;
  }, {});

  return (
    <>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Files</CardTitle>
          <div className="flex justify-between items-center mt-2">
            <Button variant="outline" size="sm" onClick={onNewFileClick}>
              <Code className="h-4 w-4 mr-2" />
              New
            </Button>
            
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="ml-2">
              <Button variant="outline" size="sm" as="span" className="cursor-pointer">
                <FileUp className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </label>
            
            <Button variant="outline" size="sm" onClick={onCommitClick} className="ml-2">
              <Code className="h-4 w-4 mr-2" />
              Commit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {activeCollaborators.length > 0 && (
          <div className="mb-3 flex items-center">
            <span className="text-xs font-medium mr-2">Active now:</span>
            <div className="flex -space-x-2">
              {activeCollaborators.map(collab => (
                <TooltipProvider key={collab.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={collab.avatar} alt={collab.name} />
                        <AvatarFallback>{collab.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>
                      {collab.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        )}
        
        <ul className="space-y-2">
          {/* Root files */}
          {filesByFolder['root'] && filesByFolder['root'].map(file => (
            <li 
              key={file.id}
              className={`p-2 cursor-pointer rounded hover:bg-accent ${selectedFile?.id === file.id ? 'bg-accent' : ''}`}
              onClick={() => setSelectedFile(file)}
            >
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="truncate">{file.name}</span>
              </div>
            </li>
          ))}
          
          {/* Folders */}
          {Object.keys(filesByFolder)
            .filter(folder => folder !== 'root')
            .map(folder => (
              <li key={folder}>
                <div 
                  className="p-2 cursor-pointer rounded hover:bg-accent flex items-center gap-2"
                  onClick={() => toggleFolder(folder)}
                >
                  <FolderPlus className="h-4 w-4" />
                  <span className="font-medium">{folder}</span>
                </div>
                
                {expandedFolders[folder] && (
                  <ul className="pl-6 mt-1 space-y-1">
                    {filesByFolder[folder].map(file => (
                      <li 
                        key={file.id}
                        className={`p-2 cursor-pointer rounded hover:bg-accent ${selectedFile?.id === file.id ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          <span className="truncate">{file.name.split('/').pop()}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          
          {files.length === 0 && (
            <li className="text-muted-foreground text-center py-2">
              No files yet. Create a new file.
            </li>
          )}
        </ul>
      </CardContent>
    </>
  );
};

export default FileList;
