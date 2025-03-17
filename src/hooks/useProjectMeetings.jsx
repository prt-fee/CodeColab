
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from '@/hooks/use-toast';

const useProjectMeetings = (project, saveProjectChanges) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    attendees: []
  });

  const handleAddMeeting = () => {
    if (!newMeeting.title.trim()) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return;
    }

    const dateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
    
    const memberNames = project.members?.slice(0, 2).map(member => member.name) || [];
    
    const newMeetingData = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: dateTime,
      duration: parseInt(newMeeting.duration),
      attendees: memberNames.length > 0 ? memberNames : ['You']
    };
    
    // Create activity record
    const newActivity = {
      id: Date.now().toString(),
      type: 'meeting',
      user: user?.name || 'You',
      target: newMeeting.title,
      timestamp: new Date().toISOString(),
      message: `${user?.name || 'You'} scheduled "${newMeeting.title}" meeting`
    };
    
    const updatedMeetings = [...(project.meetings || []), newMeetingData];
    const updatedProject = {
      ...project,
      meetings: updatedMeetings,
      collaborationActivity: [newActivity, ...(project.collaborationActivity || [])]
    };
    
    saveProjectChanges(updatedProject);

    setNewMeeting({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 30,
      attendees: []
    });
    
    setNewMeetingDialogOpen(false);
    
    toast({
      title: "Meeting scheduled",
      description: `New meeting has been added to the calendar`,
    });
    
    // Notify team members
    if (project.collaborators && project.collaborators.length > 0) {
      project.collaborators.forEach(collab => {
        addNotification({
          type: 'meeting',
          message: `New meeting for ${project.title}: "${newMeetingData.title}"`,
          sender: {
            id: user?.id || 'currentUser',
            name: user?.name || 'Current User',
            avatar: user?.avatar || ''
          },
          relatedProject: project.id
        });
      });
    }
  };

  return {
    newMeetingDialogOpen,
    setNewMeetingDialogOpen,
    newMeeting,
    setNewMeeting,
    handleAddMeeting
  };
};

export default useProjectMeetings;
