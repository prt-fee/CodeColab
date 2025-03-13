
import React, { useState } from 'react';
import { Calendar, Users, Video, Mail, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import NavBar from '@/components/NavBar';

const MeetingScheduler = () => {
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      title: 'Project Kickoff',
      date: new Date('2024-06-15T10:00:00'),
      meetLink: 'https://meet.google.com/abc-defg-hij',
      attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      project: 'Website Redesign'
    },
    {
      id: '2',
      title: 'Sprint Planning',
      date: new Date('2024-06-16T14:00:00'),
      meetLink: 'https://meet.google.com/klm-nopq-rst',
      attendees: ['John Doe', 'Sarah Williams'],
      project: 'Mobile App Development'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    attendees: [],
    project: '',
    duration: 30
  });

  // Generate a Google Meet like link
  const generateMeetLink = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const segments = [];
    
    for (let i = 0; i < 3; i++) {
      let segment = '';
      for (let j = 0; j < 4; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      segments.push(segment);
    }
    
    return `https://meet.google.com/${segments.join('-')}`;
  };

  const handleCreateMeeting = (e) => {
    e.preventDefault();
    
    if (!newMeeting.title) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return;
    }

    const meetLink = generateMeetLink();
    const dateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
    
    const newMeetingData = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: dateTime,
      meetLink,
      attendees: ['John Doe', 'Jane Smith'],
      project: newMeeting.project || 'General',
      duration: parseInt(newMeeting.duration)
    };
    
    setMeetings([...meetings, newMeetingData]);
    setIsDialogOpen(false);
    
    toast({
      title: "Meeting Scheduled",
      description: "Meeting has been created with Google Meet link",
    });
    
    // Reset form
    setNewMeeting({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      attendees: [],
      project: '',
      duration: 30
    });
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meeting Scheduler</h1>
            <p className="text-muted-foreground">
              Schedule and manage meetings with automated Google Meet integration
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.length > 0 ? (
            meetings.map(meeting => (
              <Card key={meeting.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardDescription>
                    {meeting.project}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{meeting.duration} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{meeting.attendees.length} attendees</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(meeting.meetLink);
                      toast({
                        title: "Link Copied",
                        description: "Meeting link copied to clipboard",
                      });
                    }}
                  >
                    Copy Meet Link
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.open(meeting.meetLink, '_blank');
                    }}
                  >
                    Join Meeting
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
              <p className="text-muted-foreground mb-4">
                Schedule your first meeting to get started
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </div>
          )}
        </div>

        {/* Create Meeting Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule a Meeting</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateMeeting}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                    placeholder="Enter meeting title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newMeeting.date}
                      onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select 
                    value={newMeeting.project}
                    onValueChange={(value) => setNewMeeting({...newMeeting, project: value})}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Website Redesign">Website Redesign</SelectItem>
                      <SelectItem value="Mobile App Development">Mobile App Development</SelectItem>
                      <SelectItem value="Marketing Campaign">Marketing Campaign</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select 
                    value={newMeeting.duration.toString()}
                    onValueChange={(value) => setNewMeeting({...newMeeting, duration: parseInt(value)})}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  Schedule with Google Meet
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MeetingScheduler;
