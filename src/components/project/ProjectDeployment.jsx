
import React, { useState, useRef } from 'react';
import { Upload, Server, ExternalLink, Terminal, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import useProjectUploader from '@/hooks/useProjectUploader';

const ProjectDeployment = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const { uploading, buildStatus, deploymentUrl, buildLogs, uploadAndDeploy } = useProjectUploader();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeploy = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to deploy",
        variant: "destructive"
      });
      return;
    }
    
    await uploadAndDeploy(selectedFiles);
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Deployment</h2>
        <Button 
          variant="outline" 
          size="sm"
          disabled={uploading}
          onClick={() => setSelectedFiles([])}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload & Deploy</CardTitle>
          <CardDescription>
            Upload your project files and deploy them with a single click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                webkitdirectory=""
                directory=""
              />
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Drag & drop or click to upload</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Upload your project files or select a folder to deploy
                </p>
                <Button 
                  className="mt-4" 
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  Select Files
                </Button>
              </div>
            </div>
            
            {selectedFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</h3>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <ul className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="truncate flex-1">{file.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{(file.size / 1024).toFixed(2)} KB</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
                
                <Button 
                  className="w-full mt-4"
                  onClick={handleDeploy}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Server className="h-4 w-4 mr-2" />
                      Deploy Project
                    </>
                  )}
                </Button>
              </div>
            )}
            
            {buildStatus && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Deployment Status</h3>
                  <div className="flex items-center">
                    {buildStatus === 'building' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                        Building
                      </span>
                    )}
                    {buildStatus === 'success' && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Success
                      </span>
                    )}
                    {buildStatus === 'error' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Failed
                      </span>
                    )}
                  </div>
                </div>
                
                <Card className="bg-black text-white">
                  <ScrollArea className="h-[300px] w-full">
                    <CardContent className="p-4 font-mono text-xs">
                      {buildLogs.map((log, index) => (
                        <div 
                          key={index} 
                          className={`mb-1 ${log.isError ? 'text-red-400' : 'text-green-400'}`}
                        >
                          <span className="text-gray-400">[{formatTime(log.timestamp)}]</span> {log.message}
                        </div>
                      ))}
                      {buildStatus === 'building' && (
                        <div className="animate-pulse">_</div>
                      )}
                    </CardContent>
                  </ScrollArea>
                </Card>
                
                {deploymentUrl && buildStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Deployment Complete!</h4>
                        <p className="text-sm text-muted-foreground">Your site is live at:</p>
                        <a 
                          href={deploymentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center"
                        >
                          {deploymentUrl}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Logs
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDeployment;
