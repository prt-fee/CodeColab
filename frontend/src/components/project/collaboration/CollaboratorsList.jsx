
// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { X } from 'lucide-react';
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// const CollaboratorsList = ({ collaborators = [], email, setEmail, onInviteCollaborator, onRemoveCollaborator }) => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Collaborators</CardTitle>
//         <CardDescription>People who can edit this project</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           <div className="flex items-center space-x-2 mb-4">
//             <Input 
//               placeholder="Email address" 
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <Button onClick={onInviteCollaborator}>Invite</Button>
//           </div>
          
//           {collaborators.length > 0 ? (
//             <div className="space-y-3">
//               {collaborators.map(collab => (
//                 <div key={collab.id} className="flex items-center justify-between p-3 border rounded-lg">
//                   <div className="flex items-center">
//                     <Avatar className="h-8 w-8 mr-3">
//                       <AvatarImage src={collab.avatar} alt={collab.name} />
//                       <AvatarFallback>{collab.name?.charAt(0) || 'U'}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <p className="font-medium">{collab.name}</p>
//                       <p className="text-xs text-muted-foreground">{collab.email}</p>
//                     </div>
//                   </div>
//                   <Button 
//                     variant="ghost" 
//                     size="sm" 
//                     onClick={() => onRemoveCollaborator(collab.id)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-muted-foreground">No collaborators yet</p>
//               <p className="text-sm">Invite team members to collaborate on this project</p>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default CollaboratorsList;







import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CollaboratorsList = ({ collaborators = [], email, setEmail, onInviteCollaborator, onRemoveCollaborator }) => {
  // Ensure collaborators is always an array
  const collaboratorsArray = Array.isArray(collaborators) ? collaborators : [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaborators</CardTitle>
        <CardDescription>People who can edit this project</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Input 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={onInviteCollaborator}>Invite</Button>
          </div>
          
          {collaboratorsArray.length > 0 ? (
            <div className="space-y-3">
              {collaboratorsArray.map(collab => (
                <div key={collab.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={collab.avatar} alt={collab.name} />
                      <AvatarFallback>{collab.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{collab.name}</p>
                      <p className="text-xs text-muted-foreground">{collab.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveCollaborator(collab.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No collaborators yet</p>
              <p className="text-sm">Invite team members to collaborate on this project</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaboratorsList;