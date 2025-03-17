
import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Mail, X, GitBranch, FileEdit, History, UploadCloud, File, Folder } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CollaborationPanel = ({ project, collaborators = [], onAddCollaborator, onRemoveCollaborator }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [email, setEmail] = useState('');
  const [collaborationActivity, setCollaborationActivity] = useState(project.collaborationActivity || []);
  const fileInputRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState(project.files || []);

  const handleInviteCollaborator = () => {
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Check if already a collaborator
    if (collaborators.some(collab => collab.email === email)) {
      toast({
        title: "Already a collaborator",
        description: `${email} is already a collaborator on this project`,
        variant: "destructive"
      });
      return;
    }

    const newCollaborator = {
      id: Date.now().toString(),
      email: email,
      name: email.split('@')[0],
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      role: 'editor',
      addedAt: new Date().toISOString()
    };

    // Add to collaborators
    onAddCollaborator(newCollaborator);
    
    // Create notification for the invited user
    addNotification({
      type: 'invitation',
      message: `You've been invited to collaborate on project "${project.title}"`,
      sender: {
        id: user?.id || 'currentUser',
        name: user?.name || 'Current User',
        avatar: user?.avatar || ''
      },
      relatedProject: project.id
    });

    // Add to activity log
    const newActivity = {
      id: Date.now().toString(),
      type: 'invitation',
      user: user?.name || 'You',
      target: email,
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} invited ${email} to collaborate`
    };
    
    setCollaborationActivity([newActivity, ...collaborationActivity]);
    
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${email}`,
    });
    
    setEmail('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files).map(file => {
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.split('/')[1] || 'unknown',
        size: file.size,
        uploadedBy: user?.name || 'You',
        uploadedAt: new Date().toISOString(),
        // In a real app, you would upload the file to a server and store the URL
        // For now, we'll create a local object URL
        url: URL.createObjectURL(file)
      };
    });
    
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    
    // Add activity for each uploaded file
    const newActivities = newFiles.map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type: 'upload',
      user: user?.name || 'You',
      target: file.name,
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} uploaded ${file.name}`
    }));
    
    setCollaborationActivity([...newActivities, ...collaborationActivity]);
    
    toast({
      title: "Files uploaded",
      description: `${newFiles.length} file(s) uploaded successfully`,
    });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Stream</CardTitle>
            <CardDescription>Recent collaboration activity on this project</CardDescription>
          </CardHeader>
          <CardContent>
            {collaborationActivity.length > 0 ? (
              <div className="space-y-4">
                {collaborationActivity.map(activity => (
                  <div key={activity.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {activity.type === 'edit' ? (
                          <FileEdit className="h-5 w-5 text-blue-500" />
                        ) : activity.type === 'commit' ? (
                          <GitBranch className="h-5 w-5 text-green-500" />
                        ) : activity.type === 'invitation' ? (
                          <UserPlus className="h-5 w-5 text-purple-500" />
                        ) : activity.type === 'upload' ? (
                          <UploadCloud className="h-5 w-5 text-cyan-500" />
                        ) : (
                          <History className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No activity yet</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Project Files</CardTitle>
              <CardDescription>Upload and manage project files</CardDescription>
            </div>
            <Button onClick={triggerFileUpload}>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload} 
              multiple 
            />
          </CardHeader>
          <CardContent>
            {uploadedFiles.length > 0 ? (
              <div className="space-y-2">
                {uploadedFiles.map(file => (
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
                <Button variant="outline" onClick={triggerFileUpload}>
                  Select Files
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Collaboration Settings</CardTitle>
            <CardDescription>Configure how team members can collaborate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">File Locking</h4>
                  <p className="text-sm text-muted-foreground">Prevent conflicts by locking files while editing</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Real-time Collaboration</h4>
                  <p className="text-sm text-muted-foreground">See others' changes in real-time</p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">Approval Workflow</h4>
                  <p className="text-sm text-muted-foreground">Require approvals before merging changes</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Collaborators</CardTitle>
            <CardDescription>People who can edit this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Input 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleInviteCollaborator}>Invite</Button>
              </div>
              
              {collaborators.length > 0 ? (
                <div className="space-y-3">
                  {collaborators.map(collab => (
                    <div key={collab.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={collab.avatar} alt={collab.name} />
                          <AvatarFallback>{collab.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{collab.name}</p>
                          <p className="text-xs text-muted-foreground">{collab.email}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onRemoveCollaborator(collab.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No collaborators yet</p>
                  <p className="text-sm">Invite team members to collaborate on this project</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Access Control</CardTitle>
            <CardDescription>Manage permissions for collaborators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Default Role for New Collaborators</h4>
                <select className="w-full p-2 border rounded-md bg-background">
                  <option value="viewer">Viewer (read-only)</option>
                  <option value="editor" defaultValue>Editor (can edit files)</option>
                  <option value="admin">Admin (full control)</option>
                </select>
              </div>
              
              <div className="pt-2">
                <h4 className="font-medium mb-2">Branch Protection</h4>
                <div className="flex items-center">
                  <input type="checkbox" id="protect-main" className="mr-2" />
                  <label htmlFor="protect-main">Protect main branch</label>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require code reviews before merging to main branch
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CollaborationPanel;
