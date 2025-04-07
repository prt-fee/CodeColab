
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, File } from 'lucide-react';

const FilesList = ({ files = [], onUploadClick, fileInputRef, onFileUpload, formatDate }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <File className="h-5 w-5 text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <File className="h-5 w-5 text-orange-500" />;
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <File className="h-5 w-5 text-yellow-500" />;
      case 'css':
      case 'scss':
        return <File className="h-5 w-5 text-purple-500" />;
      case 'html':
        return <File className="h-5 w-5 text-cyan-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Project Files</CardTitle>
          <CardDescription>Upload and manage project files</CardDescription>
        </div>
        <Button onClick={onUploadClick}>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={onFileUpload} 
          multiple 
        />
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(file.uploadedAt)} • Uploaded by {file.uploadedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                      <span className="sr-only">Download</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <UploadCloud className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium mb-1">No files uploaded</p>
            <p className="text-sm text-muted-foreground mb-4">
              Upload files to share with your team
            </p>
            <Button variant="outline" onClick={onUploadClick}>
              Select Files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FilesList;
