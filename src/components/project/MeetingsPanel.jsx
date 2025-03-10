
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

const MeetingItem = ({ meeting }) => {
  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{meeting.title}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {meeting.duration} min
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          {formatDate(meeting.date)}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{meeting.attendees.length} attendees</span>
        </div>
      </CardContent>
    </Card>
  );
};

const MeetingsPanel = ({ meetings, onAddMeetingClick }) => {
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
        {meetings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No meetings scheduled</p>
            <Button onClick={onAddMeetingClick}>
              Schedule a Meeting
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map(meeting => (
              <MeetingItem key={meeting.id} meeting={meeting} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MeetingsPanel;
