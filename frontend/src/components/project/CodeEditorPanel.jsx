import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Save, Code, Upload, FolderPlus, FileUp, Users, Lock, Clock } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/markdown/markdown';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CodeEditor = ({ file, onSave, collaborators }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(file?.content || '');
  const [theme, setTheme] = useState('eclipse');
  const [isFileLocked, setIsFileLocked] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null);
  const [lastEdited, setLastEdited] = useState(null);

  // Simulate real-time editing - in a real app, this would use WebSockets
  useEffect(() => {
    const simulateCollaboration = () => {
      if (collaborators && collaborators.length > 0 && !isFileLocked && file) {
        // Randomly choose a collaborator to be editing this file
        const randomIndex = Math.floor(Math.random() * collaborators.length);
        const collaborator = collaborators[randomIndex];
        
        if (Math.random() > 0.7) { // 30% chance of a collaborator editing
          setActiveEditor(collaborator);
        } else {
          setActiveEditor(null);
        }
      }
    };
    
    const interval = setInterval(simulateCollaboration, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [collaborators, isFileLocked, file]);

  // Update content when file changes
  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setActiveEditor(null);
      // Set last edited timestamp if available
      if (file.lastEdited) {
        setLastEdited(new Date(file.lastEdited));
      } else {
        setLastEdited(null);
      }
    }
  }, [file]);

  const getLanguage = (fileType) => {
    switch (fileType) {
      case 'js': return 'javascript';
      case 'css': return 'css';
      case 'html': return 'htmlmixed';
      case 'md': return 'markdown';
      default: return 'javascript';
    }
  };

  const handleSave = () => {
    onSave(file.id, content);
    setLastEdited(new Date());
    toast({
      title: "Saved",
      description: `${file.name} has been saved`,
    });
  };

  const handleLockFile = () => {
    setIsFileLocked(!isFileLocked);
    toast({
      title: isFileLocked ? "File unlocked" : "File locked",
      description: isFileLocked ? "Others can now edit this file" : "You have exclusive access to edit this file",
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-lg font-medium mr-3">{file?.name}</h3>
          {lastEdited && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>Last edited: {formatDate(lastEdited)}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <select 
            className="px-2 py-1 text-sm border rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="eclipse">Light Theme</option>
            <option value="material">Dark Theme</option>
          </select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleLockFile} variant="outline" size="sm">
                  {isFileLocked ? <Lock className="h-4 w-4" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFileLocked ? "Unlock file for collaboration" : "Lock file for exclusive editing"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      {activeEditor && (
        <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md text-sm mb-2">
          <Users className="h-4 w-4 mr-2" />
          <span className="font-medium mr-1">{activeEditor.name}</span>
          <span>is currently editing this file</span>
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={content}
          extensions={[getLanguage(file?.type)]}
          theme={theme}
          onChange={(value) => {
            if (!activeEditor || isFileLocked) {
              setContent(value);
            }
          }}
          basicSetup={{
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            indentOnInput: true,
          }}
          readOnly={activeEditor && !isFileLocked}
        />
      </div>
    </div>
  );
};

const CodeEditorPanel = ({ files, selectedFile, setSelectedFile, onSaveFile, onNewFileClick, onCommitClick, collaborators = [] }) => {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [folders, setFolders] = useState([]);
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
      
      // Save files
      onSaveFile(newFile.id, content);
      
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

  // Get active collaborators (simulated)
  const activeCollaborators = collaborators.filter((_, index) => index % 2 === 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Files</CardTitle>
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileUpload}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <Button variant="outline" size="sm" onClick={onNewFileClick}>
                <Code className="h-4 w-4 mr-2" />
                New
              </Button>
              
              <label htmlFor="file-upload">
                <Button variant="outline" size="sm" as="span" className="cursor-pointer">
                  <FileUp className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </label>
              
              <Button variant="outline" size="sm" onClick={onCommitClick}>
                <Code className="h-4 w-4 mr-2" />
                Commit
              </Button>
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
        </Card>
      </div>
      
      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Code Editor</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <CodeEditor 
                file={selectedFile} 
                onSave={onSaveFile} 
                collaborators={collaborators}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Select a file to edit or create a new file</p>
                <Button onClick={onNewFileClick} variant="outline">
                  <Code className="h-4 w-4 mr-2" />
                  Create New File
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
