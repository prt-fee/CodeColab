
import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from '@/hooks/use-toast';
import ActivityStream from './collaboration/ActivityStream';
import FilesList from './collaboration/FilesList';
import CollaborationSettings from './collaboration/CollaborationSettings';
import CollaboratorsList from './collaboration/CollaboratorsList';
import AccessControl from './collaboration/AccessControl';
import { formatDate } from './collaboration/utils';

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <ActivityStream activities={collaborationActivity} />
        
        <FilesList 
          files={uploadedFiles}
          onUploadClick={triggerFileUpload}
          fileInputRef={fileInputRef}
          onFileUpload={handleFileUpload}
          formatDate={formatDate}
        />
        
        <CollaborationSettings />
      </div>
      
      <div className="space-y-6">
        <CollaboratorsList 
          collaborators={collaborators}
          email={email}
          setEmail={setEmail}
          onInviteCollaborator={handleInviteCollaborator}
          onRemoveCollaborator={onRemoveCollaborator}
        />
        
        <AccessControl />
      </div>
    </div>
  );
};

export default CollaborationPanel;
