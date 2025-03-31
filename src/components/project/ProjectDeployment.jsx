
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Terminal, ExternalLink, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import useProjectUploader from '@/hooks/useProjectUploader';

const BuildLog = ({ log }) => {
  const getLogStyle = (message) => {
    if (message.includes('Error') || message.includes('error') || message.includes('❌')) {
      return 'text-red-500';
    } else if (message.includes('success') || message.includes('Success') || message.includes('✅')) {
      return 'text-green-500';
    } else {
      return 'text-gray-300';
    }
  };

  return (
    <div className="text-xs font-mono whitespace-pre-wrap">
      {log.map((item, index) => (
        <div key={index} className={getLogStyle(item.message)}>
          [{new Date(item.timestamp).toLocaleTimeString()}] {item.message}
        </div>
      ))}
    </div>
  );
};

const ProjectDeployment = () => {
  const [files, setFiles] = useState([]);
  const {
    uploading,
    buildStatus,
    deploymentUrl,
    buildLogs,
    uploadAndDeploy
  } = useProjectUploader();

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        title: 'No Files Selected',
        description: 'Please select at least one file to deploy',
        variant: 'destructive'
      });
      return;
    }
    
    await uploadAndDeploy(files);
  };

  const handleReset = () => {
    setFiles([]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Upload Project</CardTitle>
          <CardDescription>
            Upload your project files for automatic deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="files">Project Files</Label>
              <div 
                className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                onClick={() => document.getElementById('files').click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm mb-2">Drag and drop your project files here</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Upload a zipped project folder or individual files
                </p>
                <Input
                  id="files"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
                <Button type="button" variant="outline">
                  Select Files
                </Button>
              </div>
              {files.length > 0 && (
                <div className="text-sm mt-2">
                  <p>Selected {files.length} file(s):</p>
                  <ul className="list-disc pl-5 mt-1 text-xs">
                    {files.slice(0, 5).map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                    {files.length > 5 && <li>...and {files.length - 5} more</li>}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={files.length === 0 || uploading}>
                {uploading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Deploy Project
                  </>
                )}
              </Button>
              {(buildStatus || files.length > 0) && (
                <Button type="button" variant="outline" onClick={handleReset} disabled={uploading}>
                  Reset
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Deployment Status</CardTitle>
            <CardDescription>
              {!buildStatus && 'Upload a project to start deployment'}
              {buildStatus === 'building' && 'Building and deploying your project...'}
              {buildStatus === 'success' && 'Your project has been successfully deployed!'}
              {buildStatus === 'error' && 'There was an error deploying your project'}
            </CardDescription>
          </div>
          {buildStatus === 'success' && (
            <span className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Success
            </span>
          )}
          {buildStatus === 'error' && (
            <span className="flex items-center text-sm">
              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
              Failed
            </span>
          )}
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-md p-4 h-64 overflow-y-auto mb-4">
            {buildLogs.length > 0 ? (
              <BuildLog log={buildLogs} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Terminal className="h-6 w-6 mr-2" />
                <span>Build logs will appear here</span>
              </div>
            )}
          </div>
          
          {deploymentUrl && (
            <div className="bg-muted p-3 rounded-md flex items-center justify-between">
              <div className="text-sm truncate">
                <span className="text-muted-foreground mr-2">Deployed at:</span>
                <a href="#" className="text-blue-500 hover:underline">
                  {deploymentUrl}
                </a>
              </div>
              <Button size="sm" variant="outline">
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDeployment;
