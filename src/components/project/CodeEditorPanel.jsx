
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Save, Code } from 'lucide-react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/css/css';
import 'codemirror/mode/markdown/markdown';
import { toast } from '@/hooks/use-toast';

const CodeEditor = ({ file, onSave }) => {
  const [content, setContent] = useState(file?.content || '');
  const [theme, setTheme] = useState('eclipse');

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
    toast({
      title: "Saved",
      description: `${file.name} has been saved`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{file?.name}</h3>
        <div className="flex gap-2">
          <select 
            className="px-2 py-1 text-sm border rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="eclipse">Light Theme</option>
            <option value="material">Dark Theme</option>
          </select>
          <Button onClick={handleSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      <div className="border rounded-md overflow-hidden">
        <CodeMirror
          value={content}
          options={{
            mode: getLanguage(file?.type),
            theme: theme,
            lineNumbers: true,
            lineWrapping: true,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            extraKeys: {"Ctrl-Space": "autocomplete"},
            indentWithTabs: true,
            indentUnit: 2,
          }}
          onBeforeChange={(editor, data, value) => {
            setContent(value);
          }}
        />
      </div>
    </div>
  );
};

const CodeEditorPanel = ({ files, selectedFile, setSelectedFile, onSaveFile, onNewFileClick, onCommitClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={onNewFileClick}>
                <Code className="h-4 w-4 mr-2" />
                New
              </Button>
              
              <Button variant="ghost" size="sm" onClick={onCommitClick}>
                <Code className="h-4 w-4 mr-2" />
                Commit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {files.map(file => (
                <li 
                  key={file.id}
                  className={`p-2 cursor-pointer rounded hover:bg-accent ${selectedFile?.id === file.id ? 'bg-accent' : ''}`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                </li>
              ))}
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
              <CodeEditor file={selectedFile} onSave={onSaveFile} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Select a file to edit</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
