
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FileList from './editor/FileList';
import CodeEditor from './editor/CodeEditor';
import EmptyEditor from './editor/EmptyEditor';

const CodeEditorPanel = ({ 
  files, 
  selectedFile, 
  setSelectedFile, 
  onSaveFile, 
  onNewFileClick, 
  onCommitClick, 
  collaborators = [] 
}) => {
  // Get active collaborators (simulated)
  const activeCollaborators = collaborators.filter((_, index) => index % 2 === 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <Card>
          <FileList 
            files={files}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            onNewFileClick={onNewFileClick}
            onCommitClick={onCommitClick}
            activeCollaborators={activeCollaborators}
          />
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
              <EmptyEditor onNewFileClick={onNewFileClick} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
