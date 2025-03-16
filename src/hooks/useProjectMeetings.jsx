
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const useProjectMeetings = (project) => {
  const [newMeetingDialogOpen, setNewMeetingDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30'
  });

  const handleAddMeeting = () => {
    if (!newMeeting.title || !newMeeting.date || !newMeeting.time) {
      toast({
        title: "Error",
        description: "Meeting title, date and time are required",
        variant: "destructive"
      });
      return;
    }
    
    // Create meeting object
    const meetingToAdd = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: newMeeting.date,
      time: newMeeting.time,
      duration: parseInt(newMeeting.duration) || 30,
      createdAt: new Date().toISOString(),
      attendees: []
    };
    
    // In a real app, this would be an API call
    // For now, update in localStorage
    try {
      const savedProjects = localStorage.getItem('user_projects');
      
      if (savedProjects) {
        const projects = JSON.parse(savedProjects);
        const projectIndex = projects.findIndex(p => p.id === project.id);
        
        if (projectIndex !== -1) {
          const updatedProject = { ...projects[projectIndex] };
          
          if (!updatedProject.meetings) {
            updatedProject.meetings = [];
          }
          
          updatedProject.meetings.push(meetingToAdd);
          projects[projectIndex] = updatedProject;
          
          localStorage.setItem('user_projects', JSON.stringify(projects));
          
          // Reset form
          setNewMeeting({
            title: '',
            date: '',
            time: '',
            duration: '30'
          });
          
          setNewMeetingDialogOpen(false);
          
          toast({
            title: "Meeting scheduled",
            description: `${meetingToAdd.title} has been scheduled for ${meetingToAdd.date}`
          });
          
          // Force reload to update the project
          window.location.reload();
        }
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast({
        title: "Error",
        description: "Failed to schedule meeting",
        variant: "destructive"
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
