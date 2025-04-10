
import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmptyEditor from './EmptyEditor';

const CodeEditor = ({ file, onSave }) => {
  const [code, setCode] = useState(file?.content || '');
  const [isSaved, setIsSaved] = useState(true);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  
  // Update content when file changes
  useEffect(() => {
    if (file) {
      setCode(file.content || '');
      setIsSaved(true);
      setError(null);
      
      // Update line numbers after setting code
      setTimeout(() => updateLineNumbers(), 50);
    }
  }, [file]);

  // Update line numbers when code changes
  useEffect(() => {
    updateLineNumbers();
  }, [code]);
  
  const updateLineNumbers = () => {
    if (!lineNumbersRef.current) return;
    
    const lineCount = (code.match(/\n/g) || []).length + 1;
    const numbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
    lineNumbersRef.current.textContent = numbers;
  };

  // Handle text area input
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setIsSaved(false);
  };

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle code save
  const handleSave = () => {
    if (!file) return;
    
    try {
      // Validate code based on file type
      validateCode(code, file.name);
      
      // Save the file
      onSave({ ...file, content: code });
      setIsSaved(true);
      setError(null);
      
      toast({
        title: "File saved",
        description: `${file.name} has been saved successfully`,
      });
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error saving file",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  // Basic validation based on file type
  const validateCode = (content, fileName) => {
    // This is a very simple validation just for demonstration
    // In a real app, you'd want more sophisticated validation
    if (fileName.endsWith('.json')) {
      try {
        JSON.parse(content);
      } catch (e) {
        throw new Error('Invalid JSON format');
      }
    }
    
    // Add other validations as needed
    return true;
  };

  // Tab key handling
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      // Insert 2 spaces for tab
      const newValue = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newValue);
      
      // Move cursor position after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
      
      setIsSaved(false);
    }
  };

  // If no file is selected, show empty state
  if (!file) {
    return <EmptyEditor onNewFileClick={() => {}} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="bg-muted px-4 py-2 flex items-center justify-between">
        <div className="text-sm font-medium">{file.name}</div>
        <div className="flex items-center gap-2">
          {error ? (
            <div className="text-destructive flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          ) : isSaved ? (
            <div className="text-green-500 flex items-center text-sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Saved
            </div>
          ) : (
            <div className="text-amber-500 text-sm">Unsaved changes</div>
          )}
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={isSaved}
            className="ml-2"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex">
          <div 
            ref={lineNumbersRef}
            className="p-4 bg-muted text-right pr-2 select-none text-muted-foreground font-mono text-sm overflow-hidden"
            style={{ minWidth: '3rem' }}
          ></div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            className="flex-1 p-4 font-mono text-sm resize-none bg-background border-0 outline-none overflow-auto"
            spellCheck="false"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
