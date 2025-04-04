
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Lock } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CodeEditor = ({ file, onSave, collaborators }) => {
  const { user } = useAuth();
  const [content, setContent] = useState(file?.content || '');
  const [theme, setTheme] = useState('light');
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
      case 'jsx': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'css': return 'css';
      case 'html': return 'html';
      case 'md': return 'markdown';
      case 'json': return 'json';
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
            <option value="light">Light Theme</option>
            <option value="vs-dark">Dark Theme</option>
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
          <span className="font-medium mr-1">{activeEditor.name}</span>
          <span>is currently editing this file</span>
        </div>
      )}
      
      <div className="border rounded-md overflow-hidden">
        <Editor
          height="400px"
          language={getLanguage(file?.type)}
          theme={theme}
          value={content}
          onChange={(value) => {
            if (!activeEditor || isFileLocked) {
              setContent(value);
            }
          }}
          options={{
            minimap: { enabled: false },
            readOnly: activeEditor && !isFileLocked,
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
