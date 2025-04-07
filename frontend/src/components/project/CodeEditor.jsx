
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const CodeEditor = ({ file, onSave, collaborators = [] }) => {
  const [code, setCode] = useState(file?.content || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditorChange = (value) => {
    setCode(value);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (file && onSave) {
      onSave({
        ...file,
        content: code,
        lastModified: new Date()
      });
      setIsEditing(false);
    }
  };

  // Determine language for syntax highlighting
  const getLanguage = () => {
    if (!file) return 'javascript';
    
    const extension = file.name.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'md':
        return 'markdown';
      default:
        return 'javascript';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {file?.name} {isEditing && '(unsaved changes)'}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSave} 
          disabled={!isEditing}
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      
      <div className="border rounded-md h-[500px] overflow-hidden">
        <Editor
          height="100%"
          width="100%"
          language={getLanguage()}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      
      {collaborators.length > 0 && (
        <div className="mt-2 text-sm text-muted-foreground">
          {collaborators.length} collaborator(s) are viewing this file
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
