
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MeetingItem = ({ meeting, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return '';
    
    // Handle both Date objects and ISO strings
    const meetingDate = date instanceof Date ? date : new Date(date);
    
    if (isNaN(meetingDate.getTime())) {
      return 'Invalid Date';
    }
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(meetingDate);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(meeting.id);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-base">{meeting.title}</h3>
          <div className="flex space-x-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {meeting.duration} min
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDeleteClick}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {formatDate(meeting.date)}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{(meeting.attendees || []).length} attendees</span>
        </div>
      </CardContent>
    </Card>
  );
};

const MeetingsPanel = ({ meetings = [], onAddMeetingClick, onDeleteMeeting }) => {
  const [projectMeetings, setProjectMeetings] = useState([]);
  
  // Update meetings when the prop changes
  useEffect(() => {
    if (Array.isArray(meetings)) {
      // Ensure meetings are properly formatted
      const formattedMeetings = meetings.map(meeting => {
        // If date is a string, convert to Date object
        if (meeting.date && typeof meeting.date === 'string') {
          return {
            ...meeting,
            date: new Date(meeting.date)
          };
        }
        return meeting;
      });
      
      setProjectMeetings(formattedMeetings);
    } else {
      setProjectMeetings([]);
    }
  }, [meetings]);

  const handleDeleteMeeting = (id) => {
    // Call the parent component's delete handler if provided
    if (onDeleteMeeting) {
      onDeleteMeeting(id);
    } else {
      // Fallback to local state update if no handler provided
      setProjectMeetings(projectMeetings.filter(meeting => meeting.id !== id));
      toast({
        title: "Meeting deleted",
        description: "The meeting has been removed from the calendar"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Meetings</CardTitle>
          <CardDescription>
            Upcoming meetings for this project
          </CardDescription>
        </div>
        <Button onClick={onAddMeetingClick}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </CardHeader>
      <CardContent>
        {(!projectMeetings || projectMeetings.length === 0) ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No meetings scheduled</p>
            <Button onClick={onAddMeetingClick}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule a Meeting
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projectMeetings.map(meeting => (
              <MeetingItem 
                key={meeting.id} 
                meeting={meeting} 
                onDelete={handleDeleteMeeting}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingsPanel;
