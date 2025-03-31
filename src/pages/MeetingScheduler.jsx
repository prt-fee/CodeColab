
// import React, { useState, useEffect } from 'react';
// import NavBar from '@/components/NavBar';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Calendar, Clock, Users, Video, Calendar as CalendarIcon, Plus, Link as LinkIcon, Copy } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';
// import { useAuth } from '@/context/AuthContext';
// import useProjects from '@/hooks/useProjects';
// import { useTaskManager } from '@/hooks/useTaskManager';

// const MeetingCard = ({ meeting, onCopyLink }) => {
//   const formatDate = (date) => {
//     if (!date) return '';
//     return new Intl.DateTimeFormat('en-US', {
//       weekday: 'short',
//       month: 'short',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: 'numeric'
//     }).format(new Date(date));
//   };

//   const isMeetingSoon = (date) => {
//     const meetingDate = new Date(date);
//     const now = new Date();
//     const diffMs = meetingDate - now;
//     const diffHours = diffMs / (1000 * 60 * 60);
//     return diffHours > 0 && diffHours < 24;
//   };

//   const isLive = (date, duration) => {
//     const meetingDate = new Date(date);
//     const now = new Date();
//     const endTime = new Date(meetingDate.getTime() + duration * 60000);
//     return now >= meetingDate && now <= endTime;
//   };

//   const isPast = (date) => {
//     const meetingDate = new Date(date);
//     const now = new Date();
//     return meetingDate < now;
//   };

//   return (
//     <Card className="mb-4">
//       <CardContent className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="font-medium">{meeting.title}</h3>
//           {isLive(meeting.date, meeting.duration) && (
//             <Badge className="bg-red-500">LIVE</Badge>
//           )}
//           {isMeetingSoon(meeting.date) && !isLive(meeting.date, meeting.duration) && (
//             <Badge className="bg-yellow-500">Soon</Badge>
//           )}
//           {isPast(meeting.date) && (
//             <Badge variant="outline">Past</Badge>
//           )}
//         </div>
        
//         <div className="text-sm text-muted-foreground space-y-2 mb-3">
//           <div className="flex items-center">
//             <Calendar className="h-4 w-4 mr-2" />
//             {formatDate(meeting.date)}
//             <Clock className="h-4 w-4 mx-2" />
//             {meeting.duration} min
//           </div>
          
//           <div className="flex items-center">
//             <Users className="h-4 w-4 mr-2" />
//             {meeting.attendees && meeting.attendees.join(', ')}
//           </div>
          
//           {meeting.meetLink && (
//             <div className="flex items-center">
//               <Video className="h-4 w-4 mr-2" />
//               <a 
//                 href={meeting.meetLink} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="text-blue-500 hover:underline truncate mr-2"
//               >
//                 {meeting.meetLink}
//               </a>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 className="h-6 w-6"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   onCopyLink(meeting.meetLink);
//                 }}
//               >
//                 <Copy className="h-3 w-3" />
//               </Button>
//             </div>
//           )}
//         </div>
        
//         <div className="flex justify-between">
//           <div className="flex -space-x-2">
//             {(meeting.attendees || []).slice(0, 3).map((attendee, index) => (
//               <Avatar key={index} className="border-2 border-background h-6 w-6">
//                 <AvatarFallback>{attendee.charAt(0)}</AvatarFallback>
//               </Avatar>
//             ))}
//             {(meeting.attendees || []).length > 3 && (
//               <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs border-2 border-background">
//                 +{meeting.attendees.length - 3}
//               </div>
//             )}
//           </div>
          
//           {meeting.meetLink && !isPast(meeting.date) && (
//             <Button size="sm" variant="outline" asChild>
//               <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer">
//                 <Video className="h-3 w-3 mr-1" />
//                 Join
//               </a>
//             </Button>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const MeetingScheduler = () => {
//   const { user } = useAuth();
//   const { projects } = useProjects();
//   const { tasks } = useTaskManager();
  
//   const [meetings, setMeetings] = useState([]);
//   const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
//   const [newMeeting, setNewMeeting] = useState({
//     title: '',
//     date: new Date().toISOString().split('T')[0],
//     time: '10:00',
//     duration: 30,
//     attendees: [],
//     projectId: '',
//     taskId: '',
//     description: ''
//   });
  
//   useEffect(() => {
//     // Load meetings from localStorage
//     const savedMeetings = localStorage.getItem('user_meetings');
//     if (savedMeetings) {
//       try {
//         const parsedMeetings = JSON.parse(savedMeetings);
//         if (Array.isArray(parsedMeetings)) {
//           setMeetings(parsedMeetings);
//         }
//       } catch (e) {
//         console.error('Failed to parse saved meetings:', e);
//         // Initialize with some mock meetings
//         const mockMeetings = [
//           {
//             id: '1',
//             title: 'Project Kickoff',
//             date: new Date(Date.now() + 2 * 60 * 60 * 1000),
//             duration: 60,
//             attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
//             meetLink: 'https://meet.google.com/abc-defg-hij',
//             projectId: '1'
//           },
//           {
//             id: '2',
//             title: 'Sprint Planning',
//             date: new Date(Date.now() + 24 * 60 * 60 * 1000),
//             duration: 45,
//             attendees: ['John Doe', 'Sarah Williams'],
//             meetLink: 'https://meet.google.com/xyz-abcd-efg',
//             projectId: '2'
//           },
//           {
//             id: '3',
//             title: 'Design Review',
//             date: new Date(Date.now() - 2 * 60 * 60 * 1000),
//             duration: 30,
//             attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
//             meetLink: 'https://meet.google.com/123-456-789',
//             projectId: '1'
//           }
//         ];
//         setMeetings(mockMeetings);
//       }
//     } else {
//       // Initialize with some mock meetings
//       const mockMeetings = [
//         {
//           id: '1',
//           title: 'Project Kickoff',
//           date: new Date(Date.now() + 2 * 60 * 60 * 1000),
//           duration: 60,
//           attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
//           meetLink: 'https://meet.google.com/abc-defg-hij',
//           projectId: '1'
//         },
//         {
//           id: '2',
//           title: 'Sprint Planning',
//           date: new Date(Date.now() + 24 * 60 * 60 * 1000),
//           duration: 45,
//           attendees: ['John Doe', 'Sarah Williams'],
//           meetLink: 'https://meet.google.com/xyz-abcd-efg',
//           projectId: '2'
//         },
//         {
//           id: '3',
//           title: 'Design Review',
//           date: new Date(Date.now() - 2 * 60 * 60 * 1000),
//           duration: 30,
//           attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
//           meetLink: 'https://meet.google.com/123-456-789',
//           projectId: '1'
//         }
//       ];
//       setMeetings(mockMeetings);
//     }
//   }, []);
  
//   const handleAddMeeting = () => {
//     if (!newMeeting.title) {
//       toast({
//         title: "Error",
//         description: "Meeting title is required",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     const dateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
    
//     // Generate a mock Google Meet link
//     const randomCode = Math.random().toString(36).substring(2, 11);
//     const meetLink = `https://meet.google.com/${randomCode}`;
    
//     const meeting = {
//       id: Date.now().toString(),
//       title: newMeeting.title,
//       date: dateTime,
//       duration: parseInt(newMeeting.duration),
//       attendees: newMeeting.attendees.length > 0 ? newMeeting.attendees : ['You'],
//       projectId: newMeeting.projectId,
//       taskId: newMeeting.taskId,
//       description: newMeeting.description,
//       meetLink: meetLink
//     };
    
//     const updatedMeetings = [...meetings, meeting];
//     setMeetings(updatedMeetings);
    
//     // Save to localStorage
//     localStorage.setItem('user_meetings', JSON.stringify(updatedMeetings));
    
//     setNewMeeting({
//       title: '',
//       date: new Date().toISOString().split('T')[0],
//       time: '10:00',
//       duration: 30,
//       attendees: [],
//       projectId: '',
//       taskId: '',
//       description: ''
//     });
    
//     setShowAddMeetingModal(false);
    
//     toast({
//       title: "Meeting scheduled",
//       description: "Meeting has been scheduled with auto-generated Google Meet link",
//     });
//   };
  
//   const handleCopyLink = (link) => {
//     navigator.clipboard.writeText(link);
//     toast({
//       title: "Link copied",
//       description: "Meeting link copied to clipboard",
//     });
//   };
  
//   const upcomingMeetings = meetings.filter(meeting => new Date(meeting.date) > new Date());
//   const pastMeetings = meetings.filter(meeting => new Date(meeting.date) <= new Date());
  
//   const todayMeetings = upcomingMeetings.filter(meeting => {
//     const meetingDate = new Date(meeting.date);
//     const today = new Date();
//     return meetingDate.getDate() === today.getDate() &&
//            meetingDate.getMonth() === today.getMonth() &&
//            meetingDate.getFullYear() === today.getFullYear();
//   });

//   return (
//     <div className="min-h-screen bg-background">
//       <NavBar />
//       <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold mb-1">Meeting Scheduler</h1>
//             <p className="text-muted-foreground">Schedule and manage your meetings</p>
//           </div>
//           <Button onClick={() => setShowAddMeetingModal(true)}>
//             <Plus className="h-4 w-4 mr-2" />
//             New Meeting
//           </Button>
//         </div>
        
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-2">
//             <Tabs defaultValue="upcoming">
//               <TabsList className="mb-4">
//                 <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//                 <TabsTrigger value="today">Today</TabsTrigger>
//                 <TabsTrigger value="past">Past</TabsTrigger>
//               </TabsList>
              
//               <TabsContent value="upcoming">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Upcoming Meetings</CardTitle>
//                     <CardDescription>
//                       Scheduled meetings coming up
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {upcomingMeetings.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
//                         <p>No upcoming meetings scheduled</p>
//                         <Button 
//                           variant="outline" 
//                           className="mt-4"
//                           onClick={() => setShowAddMeetingModal(true)}
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Schedule a Meeting
//                         </Button>
//                       </div>
//                     ) : (
//                       upcomingMeetings.map(meeting => (
//                         <MeetingCard 
//                           key={meeting.id} 
//                           meeting={meeting}
//                           onCopyLink={handleCopyLink}
//                         />
//                       ))
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>
              
//               <TabsContent value="today">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Today's Meetings</CardTitle>
//                     <CardDescription>
//                       Meetings scheduled for today
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {todayMeetings.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
//                         <p>No meetings scheduled for today</p>
//                         <Button 
//                           variant="outline" 
//                           className="mt-4"
//                           onClick={() => setShowAddMeetingModal(true)}
//                         >
//                           <Plus className="h-4 w-4 mr-2" />
//                           Schedule a Meeting
//                         </Button>
//                       </div>
//                     ) : (
//                       todayMeetings.map(meeting => (
//                         <MeetingCard 
//                           key={meeting.id} 
//                           meeting={meeting}
//                           onCopyLink={handleCopyLink}
//                         />
//                       ))
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>
              
//               <TabsContent value="past">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Past Meetings</CardTitle>
//                     <CardDescription>
//                       Previous meeting history
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {pastMeetings.length === 0 ? (
//                       <div className="text-center py-8 text-muted-foreground">
//                         <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
//                         <p>No past meetings</p>
//                       </div>
//                     ) : (
//                       pastMeetings.map(meeting => (
//                         <MeetingCard 
//                           key={meeting.id} 
//                           meeting={meeting}
//                           onCopyLink={handleCopyLink}
//                         />
//                       ))
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>
          
//           <div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Meeting Statistics</CardTitle>
//                 <CardDescription>
//                   Overview of your meeting schedule
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className="bg-primary/10 p-2 rounded-md mr-3">
//                         <Calendar className="h-5 w-5 text-primary" />
//                       </div>
//                       <span className="font-medium">Total Meetings</span>
//                     </div>
//                     <span className="text-xl font-bold">{meetings.length}</span>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className="bg-primary/10 p-2 rounded-md mr-3">
//                         <Clock className="h-5 w-5 text-primary" />
//                       </div>
//                       <span className="font-medium">Today's Meetings</span>
//                     </div>
//                     <span className="text-xl font-bold">{todayMeetings.length}</span>
//                   </div>
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <div className="bg-primary/10 p-2 rounded-md mr-3">
//                         <Users className="h-5 w-5 text-primary" />
//                       </div>
//                       <span className="font-medium">Upcoming Meetings</span>
//                     </div>
//                     <span className="text-xl font-bold">{upcomingMeetings.length}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
      
//       {showAddMeetingModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <Card className="w-full max-w-md">
//             <CardHeader>
//               <CardTitle>Schedule New Meeting</CardTitle>
//               <CardDescription>Create a new meeting with Google Meet integration</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="title">Meeting Title</Label>
//                   <Input
//                     id="title"
//                     value={newMeeting.title}
//                     onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
//                     placeholder="Enter meeting title"
//                   />
//                 </div>
                
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="date">Date</Label>
//                     <Input
//                       id="date"
//                       type="date"
//                       value={newMeeting.date}
//                       onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="time">Time</Label>
//                     <Input
//                       id="time"
//                       type="time"
//                       value={newMeeting.time}
//                       onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
//                     />
//                   </div>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="duration">Duration (minutes)</Label>
//                   <Select
//                     value={newMeeting.duration.toString()}
//                     onValueChange={(value) => setNewMeeting({...newMeeting, duration: parseInt(value)})}
//                   >
//                     <SelectTrigger id="duration">
//                       <SelectValue placeholder="Select duration" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="15">15 minutes</SelectItem>
//                       <SelectItem value="30">30 minutes</SelectItem>
//                       <SelectItem value="45">45 minutes</SelectItem>
//                       <SelectItem value="60">1 hour</SelectItem>
//                       <SelectItem value="90">1.5 hours</SelectItem>
//                       <SelectItem value="120">2 hours</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="attendees">Attendees</Label>
//                   <Input
//                     id="attendees"
//                     placeholder="Enter names separated by commas"
//                     value={newMeeting.attendees.join(', ')}
//                     onChange={(e) => setNewMeeting({
//                       ...newMeeting, 
//                       attendees: e.target.value.split(',').map(name => name.trim()).filter(Boolean)
//                     })}
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="project">Related Project (Optional)</Label>
//                   <Select
//                     value={newMeeting.projectId}
//                     onValueChange={(value) => setNewMeeting({...newMeeting, projectId: value})}
//                   >
//                     <SelectTrigger id="project">
//                       <SelectValue placeholder="Select project" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="">None</SelectItem>
//                       {projects.map(project => (
//                         <SelectItem key={project.id} value={project.id}>
//                           {project.title}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="flex justify-end gap-2 pt-4">
//                   <Button 
//                     type="button" 
//                     variant="outline" 
//                     onClick={() => setShowAddMeetingModal(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="button" onClick={handleAddMeeting}>
//                     <LinkIcon className="h-4 w-4 mr-2" />
//                     Schedule with Google Meet
//                   </Button>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MeetingScheduler;



import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Video, Calendar as CalendarIcon, Plus, Link as LinkIcon, Copy, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import useProjects from '@/hooks/useProjects';
import { useTaskManager } from '@/hooks/useTaskManager';

const MeetingCard = ({ meeting, onCopyLink, onDeleteMeeting }) => {
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

  const isMeetingSoon = (date) => {
    const meetingDate = new Date(date);
    const now = new Date();
    const diffMs = meetingDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 24;
  };

  const isLive = (date, duration) => {
    const meetingDate = new Date(date);
    const now = new Date();
    const endTime = new Date(meetingDate.getTime() + duration * 60000);
    return now >= meetingDate && now <= endTime;
  };

  const isPast = (date) => {
    const meetingDate = new Date(date);
    const now = new Date();
    return meetingDate < now;
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{meeting.title}</h3>
          {isLive(meeting.date, meeting.duration) && (
            <Badge className="bg-red-500">LIVE</Badge>
          )}
          {isMeetingSoon(meeting.date) && !isLive(meeting.date, meeting.duration) && (
            <Badge className="bg-yellow-500">Soon</Badge>
          )}
          {isPast(meeting.date) && (
            <Badge variant="outline">Past</Badge>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground space-y-2 mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDate(meeting.date)}
            <Clock className="h-4 w-4 mx-2" />
            {meeting.duration} min
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {meeting.attendees && meeting.attendees.join(', ')}
          </div>
          
          {meeting.meetLink && (
            <div className="flex items-center">
              <Video className="h-4 w-4 mr-2" />
              <a 
                href={meeting.meetLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline truncate mr-2"
              >
                {meeting.meetLink}
              </a>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={(e) => {
                  e.preventDefault();
                  onCopyLink(meeting.meetLink);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <div className="flex -space-x-2">
            {(meeting.attendees || []).slice(0, 3).map((attendee, index) => (
              <Avatar key={index} className="border-2 border-background h-6 w-6">
                <AvatarFallback>{attendee.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {(meeting.attendees || []).length > 3 && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs border-2 border-background">
                +{meeting.attendees.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {meeting.meetLink && !isPast(meeting.date) && (
              <Button size="sm" variant="outline" asChild>
                <a href={meeting.meetLink} target="_blank" rel="noopener noreferrer">
                  <Video className="h-3 w-3 mr-1" />
                  Join
                </a>
              </Button>
            )}
            
            {onDeleteMeeting && (
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onDeleteMeeting(meeting.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MeetingScheduler = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { tasks } = useTaskManager();
  
  const [meetings, setMeetings] = useState([]);
  const [showAddMeetingModal, setShowAddMeetingModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 30,
    attendees: [],
    projectId: '',
    taskId: '',
    description: ''
  });
  
  useEffect(() => {
    // Load meetings from localStorage
    const savedMeetings = localStorage.getItem('user_meetings');
    if (savedMeetings) {
      try {
        const parsedMeetings = JSON.parse(savedMeetings);
        if (Array.isArray(parsedMeetings)) {
          setMeetings(parsedMeetings);
        }
      } catch (e) {
        console.error('Failed to parse saved meetings:', e);
        initializeMockMeetings();
      }
    } else {
      initializeMockMeetings();
    }
  }, []);
  
  const initializeMockMeetings = () => {
    const mockMeetings = [
      {
        id: '1',
        title: 'Project Kickoff',
        date: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 60,
        attendees: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        meetLink: 'https://meet.google.com/abc-defg-hij',
        projectId: '1'
      },
      {
        id: '2',
        title: 'Sprint Planning',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 45,
        attendees: ['John Doe', 'Sarah Williams'],
        meetLink: 'https://meet.google.com/xyz-abcd-efg',
        projectId: '2'
      },
      {
        id: '3',
        title: 'Design Review',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000),
        duration: 30,
        attendees: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'],
        meetLink: 'https://meet.google.com/123-456-789',
        projectId: '1'
      }
    ];
    setMeetings(mockMeetings);
  };
  
  const handleAddMeeting = () => {
    if (!newMeeting.title) {
      toast({
        title: "Error",
        description: "Meeting title is required",
        variant: "destructive"
      });
      return;
    }
    
    const dateTime = new Date(`${newMeeting.date}T${newMeeting.time}`);
    
    // Generate a mock Google Meet link
    const randomCode = Math.random().toString(36).substring(2, 11);
    const meetLink = `https://meet.google.com/${randomCode}`;
    
    const meeting = {
      id: Date.now().toString(),
      title: newMeeting.title,
      date: dateTime,
      duration: parseInt(newMeeting.duration),
      attendees: newMeeting.attendees.length > 0 ? newMeeting.attendees : ['You'],
      projectId: newMeeting.projectId,
      taskId: newMeeting.taskId,
      description: newMeeting.description,
      meetLink: meetLink
    };
    
    const updatedMeetings = [...meetings, meeting];
    setMeetings(updatedMeetings);
    
    // Save to localStorage
    localStorage.setItem('user_meetings', JSON.stringify(updatedMeetings));
    
    setNewMeeting({
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      duration: 30,
      attendees: [],
      projectId: '',
      taskId: '',
      description: ''
    });
    
    setShowAddMeetingModal(false);
    
    toast({
      title: "Meeting scheduled",
      description: "Meeting has been scheduled with auto-generated Google Meet link",
    });
  };
  
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Meeting link copied to clipboard",
    });
  };
  
  const handleDeleteMeeting = (meetingId) => {
    const updatedMeetings = meetings.filter(meeting => meeting.id !== meetingId);
    setMeetings(updatedMeetings);
    
    // Save to localStorage
    localStorage.setItem('user_meetings', JSON.stringify(updatedMeetings));
    
    toast({
      title: "Meeting deleted",
      description: "The meeting has been removed from your schedule",
    });
  };
  
  const upcomingMeetings = meetings.filter(meeting => new Date(meeting.date) > new Date());
  const pastMeetings = meetings.filter(meeting => new Date(meeting.date) <= new Date());
  
  const todayMeetings = upcomingMeetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    const today = new Date();
    return meetingDate.getDate() === today.getDate() &&
           meetingDate.getMonth() === today.getMonth() &&
           meetingDate.getFullYear() === today.getFullYear();
  });

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Meeting Scheduler</h1>
            <p className="text-muted-foreground">Schedule and manage your meetings</p>
          </div>
          <Button onClick={() => setShowAddMeetingModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Meeting
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Meetings</CardTitle>
                    <CardDescription>
                      Scheduled meetings coming up
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {upcomingMeetings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No upcoming meetings scheduled</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setShowAddMeetingModal(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule a Meeting
                        </Button>
                      </div>
                    ) : (
                      upcomingMeetings.map(meeting => (
                        <MeetingCard 
                          key={meeting.id} 
                          meeting={meeting}
                          onCopyLink={handleCopyLink}
                          onDeleteMeeting={handleDeleteMeeting}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="today">
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Meetings</CardTitle>
                    <CardDescription>
                      Meetings scheduled for today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {todayMeetings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No meetings scheduled for today</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setShowAddMeetingModal(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Schedule a Meeting
                        </Button>
                      </div>
                    ) : (
                      todayMeetings.map(meeting => (
                        <MeetingCard 
                          key={meeting.id} 
                          meeting={meeting}
                          onCopyLink={handleCopyLink}
                          onDeleteMeeting={handleDeleteMeeting}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="past">
                <Card>
                  <CardHeader>
                    <CardTitle>Past Meetings</CardTitle>
                    <CardDescription>
                      Previous meeting history
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {pastMeetings.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p>No past meetings</p>
                      </div>
                    ) : (
                      pastMeetings.map(meeting => (
                        <MeetingCard 
                          key={meeting.id} 
                          meeting={meeting}
                          onCopyLink={handleCopyLink}
                          onDeleteMeeting={handleDeleteMeeting}
                        />
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Meeting Statistics</CardTitle>
                <CardDescription>
                  Overview of your meeting schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md mr-3">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">Total Meetings</span>
                    </div>
                    <span className="text-xl font-bold">{meetings.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md mr-3">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">Today's Meetings</span>
                    </div>
                    <span className="text-xl font-bold">{todayMeetings.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-md mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium">Upcoming Meetings</span>
                    </div>
                    <span className="text-xl font-bold">{upcomingMeetings.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {showAddMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Schedule New Meeting</CardTitle>
              <CardDescription>Create a new meeting with Google Meet integration</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                handleAddMeeting();
              }}>
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                    placeholder="Enter meeting title"
                    required
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
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newMeeting.time}
                      onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                      required
                    />
                  </div>
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
                
                <div className="space-y-2">
                  <Label htmlFor="attendees">Attendees</Label>
                  <Input
                    id="attendees"
                    placeholder="Enter names separated by commas"
                    value={typeof newMeeting.attendees === 'string' ? newMeeting.attendees : newMeeting.attendees.join(', ')}
                    onChange={(e) => setNewMeeting({
                      ...newMeeting, 
                      attendees: e.target.value.split(',').map(name => name.trim()).filter(Boolean)
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project">Related Project (Optional)</Label>
                  <Select
                    value={newMeeting.projectId}
                    onValueChange={(value) => setNewMeeting({...newMeeting, projectId: value})}
                  >
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Enter meeting description"
                    value={newMeeting.description}
                    onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddMeetingModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Schedule with Google Meet
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MeetingScheduler;