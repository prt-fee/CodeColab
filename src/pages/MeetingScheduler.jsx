
import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Plus, Users, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const MeetingItem = ({ meeting, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(d);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{meeting.title}</h3>
          <Button variant="ghost" size="sm" onClick={() => onDelete(meeting.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-2" />
          {formatDate(meeting.date)}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          {meeting.duration} minutes
        </div>
        <div className="flex items-center text-sm text-muted-foreground mt-2">
          <Users className="h-4 w-4 mr-2" />
          {meeting.attendees.join(', ')}
        </div>
      </CardContent>
    </Card>
  );
};

const NewMeetingDialog = ({ isOpen, onOpenChange, onAddMeeting }) => {
  const [meeting, setMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    attendees: ''
  });

  const handleSubmit = () => {
    if (!meeting.title.trim()) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return;
    }

    const dateTime = new Date(`${meeting.date}T${meeting.time}`);
    const attendeesList = meeting.attendees.split(',').map(a => a.trim()).filter(a => a);
    
    onAddMeeting({
      id: Date.now().toString(),
      title: meeting.title,
      date: dateTime,
      duration: parseInt(meeting.duration),
      attendees: attendeesList.length > 0 ? attendeesList : ['You']
    });

    // Reset form
    setMeeting({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 30,
      attendees: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule a Meeting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={meeting.title}
              onChange={(e) => setMeeting({...meeting, title: e.target.value})}
              placeholder="Enter meeting title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={meeting.date}
                onChange={(e) => setMeeting({...meeting, date: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={meeting.time}
                onChange={(e) => setMeeting({...meeting, time: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={meeting.duration}
              onChange={(e) => setMeeting({...meeting, duration: e.target.value})}
              min="15"
              step="15"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendees">Attendees (comma separated)</Label>
            <Input
              id="attendees"
              value={meeting.attendees}
              onChange={(e) => setMeeting({...meeting, attendees: e.target.value})}
              placeholder="John Doe, Jane Smith"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Schedule Meeting</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MeetingScheduler = () => {
  const [meetings, setMeetings] = useState([]);
  const [isNewMeetingDialogOpen, setIsNewMeetingDialogOpen] = useState(false);
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load saved meetings from localStorage
  useEffect(() => {
    if (user) {
      const savedMeetings = localStorage.getItem(`meetings_${user.id}`);
      if (savedMeetings) {
        try {
          const parsedMeetings = JSON.parse(savedMeetings);
          // Convert date strings back to Date objects
          const processedMeetings = parsedMeetings.map(meeting => ({
            ...meeting,
            date: new Date(meeting.date)
          }));
          setMeetings(processedMeetings);
        } catch (error) {
          console.error('Error parsing saved meetings:', error);
        }
      }
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Save meetings to localStorage when they change
  useEffect(() => {
    if (user && meetings.length > 0) {
      localStorage.setItem(`meetings_${user.id}`, JSON.stringify(meetings));
    }
  }, [meetings, user]);

  const handleAddMeeting = (newMeeting) => {
    setMeetings([newMeeting, ...meetings]);
    setIsNewMeetingDialogOpen(false);
    
    toast({
      title: "Meeting scheduled",
      description: `${newMeeting.title} has been added to your calendar`,
    });
  };

  const handleDeleteMeeting = (id) => {
    setMeetings(meetings.filter(meeting => meeting.id !== id));
    
    toast({
      title: "Meeting deleted",
      description: "The meeting has been removed from your calendar",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, don't render the content
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 pt-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meeting Scheduler</h1>
          <p className="text-muted-foreground">
            Organize and manage your project meetings
          </p>
        </header>
        
        <div className="flex justify-end mb-6">
          <Button onClick={() => setIsNewMeetingDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Your scheduled meetings</CardDescription>
              </CardHeader>
              <CardContent>
                {meetings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No meetings scheduled</p>
                    <Button onClick={() => setIsNewMeetingDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule a Meeting
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meetings
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map(meeting => (
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
          </div>
          
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Tips</CardTitle>
                <CardDescription>Make your meetings more effective</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                    <p>Set a clear agenda and share it in advance</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                    <p>Keep meetings under 45 minutes when possible</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                    <p>Assign action items and follow up after the meeting</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                    <p>Start and end on time to respect everyone's schedule</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">5</span>
                    <p>Only invite those who need to be there</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <NewMeetingDialog 
        isOpen={isNewMeetingDialogOpen}
        onOpenChange={setIsNewMeetingDialogOpen}
        onAddMeeting={handleAddMeeting}
      />
    </div>
  );
};

export default MeetingScheduler;
