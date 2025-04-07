
// import React, { useState } from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Users, UserPlus, Mail, X } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { toast } from '@/hooks/use-toast';
// import { 
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";

// const TeamPanel = ({ members }) => {
//   const [showAddMember, setShowAddMember] = useState(false);
//   const [newMember, setNewMember] = useState({ name: '', email: '', avatar: '' });
//   const [teamMembers, setTeamMembers] = useState(members || []);

//   const handleAddMember = () => {
//     if (!newMember.name.trim() || !newMember.email.trim()) {
//       toast({
//         title: "Error",
//         description: "Name and email are required",
//         variant: "destructive"
//       });
//       return;
//     }

//     // Generate random avatar if not provided
//     const avatar = newMember.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
    
//     const memberToAdd = {
//       id: Date.now().toString(),
//       name: newMember.name,
//       email: newMember.email,
//       avatar
//     };
    
//     setTeamMembers([...teamMembers, memberToAdd]);
//     setNewMember({ name: '', email: '', avatar: '' });
//     setShowAddMember(false);
    
//     toast({
//       title: "Team member added",
//       description: `${newMember.name} has been added to the team`
//     });
//   };

//   const handleRemoveMember = (id) => {
//     setTeamMembers(teamMembers.filter(member => member.id !== id));
//     toast({
//       title: "Team member removed",
//       description: "The team member has been removed"
//     });
//   };

//   const handleSendInvitation = (email) => {
//     toast({
//       title: "Invitation sent",
//       description: `Invitation has been sent to ${email}`
//     });
//   };

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between">
//         <div>
//           <CardTitle>Team Members</CardTitle>
//           <CardDescription>
//             People working on this project
//           </CardDescription>
//         </div>
//         <Button onClick={() => setShowAddMember(true)}>
//           <UserPlus className="h-4 w-4 mr-2" />
//           Add Member
//         </Button>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {teamMembers.length === 0 ? (
//             <div className="text-center py-8">
//               <p className="text-muted-foreground mb-4">No team members yet</p>
//               <Button variant="outline" onClick={() => setShowAddMember(true)}>
//                 <UserPlus className="h-4 w-4 mr-2" />
//                 Add Team Member
//               </Button>
//             </div>
//           ) : (
//             teamMembers.map(member => (
//               <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex items-center">
//                   <div className="h-10 w-10 rounded-full bg-accent overflow-hidden mr-3">
//                     <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
//                   </div>
//                   <div>
//                     <h4 className="font-medium">{member.name}</h4>
//                     <p className="text-xs text-muted-foreground">{member.email}</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button 
//                     variant="ghost" 
//                     size="sm"
//                     onClick={() => handleSendInvitation(member.email)}
//                   >
//                     <Mail className="h-4 w-4" />
//                   </Button>
//                   <Button 
//                     variant="ghost" 
//                     size="sm"
//                     onClick={() => handleRemoveMember(member.id)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </CardContent>

//       <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Add Team Member</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 py-4">
//             <div className="space-y-2">
//               <label htmlFor="name" className="text-sm font-medium">Name</label>
//               <Input
//                 id="name"
//                 value={newMember.name}
//                 onChange={(e) => setNewMember({...newMember, name: e.target.value})}
//                 placeholder="Enter member name"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="email" className="text-sm font-medium">Email</label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={newMember.email}
//                 onChange={(e) => setNewMember({...newMember, email: e.target.value})}
//                 placeholder="Enter member email"
//               />
//             </div>
//             <div className="space-y-2">
//               <label htmlFor="avatar" className="text-sm font-medium">Avatar URL (optional)</label>
//               <Input
//                 id="avatar"
//                 value={newMember.avatar}
//                 onChange={(e) => setNewMember({...newMember, avatar: e.target.value})}
//                 placeholder="Enter avatar URL"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
//             <Button onClick={handleAddMember}>Add Member</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </Card>
//   );
// };

// export default TeamPanel;






import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Mail, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const TeamPanel = ({ members = [] }) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', avatar: '' });
  
  // Convert members to array if it's not already
  const [teamMembers, setTeamMembers] = useState(
    Array.isArray(members) ? members : []
  );
  
  // Update teamMembers when the members prop changes
  useEffect(() => {
    setTeamMembers(Array.isArray(members) ? members : []);
  }, [members]);

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    // Generate random avatar if not provided
    const avatar = newMember.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
    
    const memberToAdd = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      avatar
    };
    
    setTeamMembers([...teamMembers, memberToAdd]);
    setNewMember({ name: '', email: '', avatar: '' });
    setShowAddMember(false);
    
    toast({
      title: "Team member added",
      description: `${newMember.name} has been added to the team`
    });
  };

  const handleRemoveMember = (id) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast({
      title: "Team member removed",
      description: "The team member has been removed"
    });
  };

  const handleSendInvitation = (email) => {
    toast({
      title: "Invitation sent",
      description: `Invitation has been sent to ${email}`
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            People working on this project
          </CardDescription>
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No team members yet</p>
              <Button variant="outline" onClick={() => setShowAddMember(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          ) : (
            teamMembers.map((member, index) => (
              <div key={member.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-accent overflow-hidden mr-3">
                    <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" 
                         onError={(e) => {e.target.src = 'https://i.pravatar.cc/150'; e.target.onerror = null;}} />
                  </div>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleSendInvitation(member.email)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder="Enter member name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                placeholder="Enter member email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="avatar" className="text-sm font-medium">Avatar URL (optional)</label>
              <Input
                id="avatar"
                value={newMember.avatar}
                onChange={(e) => setNewMember({...newMember, avatar: e.target.value})}
                placeholder="Enter avatar URL"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TeamPanel;