
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectMeetings = (projectId) => {
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date(),
    time: '',
    duration: 30,
    location: '',
    description: '',
    attendees: []
  });

  const handleAddMeeting = () => {
    if (!newMeeting.title) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return false;
    }
    
    // Get stored projects
    const storedProjects = JSON.parse(localStorage.getItem('user_projects') || '[]');
    
    // Find the current project
    const projectIndex = storedProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      // Create a new meeting
      const meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        date: newMeeting.date.toISOString(),
        time: newMeeting.time,
        duration: newMeeting.duration,
        location: newMeeting.location,
        description: newMeeting.description,
        attendees: newMeeting.attendees,
        createdAt: new Date().toISOString()
      };
      
      // Add the meeting to the project
      const updatedProjects = [...storedProjects];
      const currentProject = {...updatedProjects[projectIndex]};
      
      if (!currentProject.meetings) {
        currentProject.meetings = [];
      }
      
      currentProject.meetings.push(meeting);
      updatedProjects[projectIndex] = currentProject;
      
      // Update localStorage
      localStorage.setItem('user_projects', JSON.stringify(updatedProjects));
      
      // Clear the form and close the dialog
      setNewMeeting({
        title: '',
        date: new Date(),
        time: '',
        duration: 30,
        location: '',
        description: '',
        attendees: []
      });
      setNewMeetingDialogOpen(false);
      
      toast({
        title: "Meeting scheduled",
        description: `"${meeting.title}" has been added to the project`,
      });
      
      return true;
    }
    
    return false;
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
