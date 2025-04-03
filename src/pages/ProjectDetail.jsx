
// // import React, { useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import NavBar from '@/components/NavBar';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Loader2, ArrowLeft, CalendarDays, Users, Search, UserPlus } from 'lucide-react';
// // import ProjectDetailTabs from '@/components/project/ProjectDetailTabs';
// // import { NewFileDialog, NewMeetingDialog, NewTaskDialog, NewCommitDialog } from '@/components/project/ProjectDialogs';
// // import {
// //   Sheet,
// //   SheetContent,
// //   SheetDescription,
// //   SheetHeader,
// //   SheetTitle,
// //   SheetTrigger,
// // } from "@/components/ui/sheet";
// // import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// // import useProjectDetail from '@/hooks/useProjectDetail';
// // import { toast } from '@/hooks/use-toast';
// // import { useNotifications } from '@/context/NotificationsContext';

// // // Mock users for search feature
// // const MOCK_USERS = [
// //   { id: 'u1', name: 'John Doe', email: 'john@example.com', avatar: '' },
// //   { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
// //   { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
// // ];

// // const ProjectDetail = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { addNotification } = useNotifications();
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [searchResults, setSearchResults] = useState([]);
// //   const [teamSheetOpen, setTeamSheetOpen] = useState(false);
  
// //   const {
// //     project,
// //     isLoading,
// //     selectedFile, 
// //     setSelectedFile,
// //     projectTasks,
// //     newFileName, 
// //     setNewFileName,
// //     newFileType, 
// //     setNewFileType,
// //     newFileDialogOpen, 
// //     setNewFileDialogOpen,
// //     newMeetingDialogOpen, 
// //     setNewMeetingDialogOpen,
// //     newTaskDialogOpen, 
// //     setNewTaskDialogOpen,
// //     newCommitDialogOpen, 
// //     setNewCommitDialogOpen,
// //     commitMessage, 
// //     setCommitMessage,
// //     newMeeting, 
// //     setNewMeeting,
// //     newTask, 
// //     setNewTask,
// //     handleSaveFile,
// //     handleAddFile,
// //     handleAddCommit,
// //     handleAddMeeting,
// //     handleAddTask,
// //     handleAddCollaborator,
// //     handleRemoveCollaborator,
// //     handleGoBack
// //   } = useProjectDetail(id);

// //   const handleSearch = (term) => {
// //     setSearchTerm(term);
// //     if (term.trim().length > 0) {
// //       const results = MOCK_USERS.filter(user => 
// //         user.name.toLowerCase().includes(term.toLowerCase()) ||
// //         user.email.toLowerCase().includes(term.toLowerCase())
// //       );
// //       setSearchResults(results);
// //     } else {
// //       setSearchResults([]);
// //     }
// //   };

// //   const handleAddUser = (user) => {
// //     // Check if user is already a member
// //     const isMember = project.members && project.members.some(member => member.id === user.id);
    
// //     if (isMember) {
// //       toast({
// //         title: "User already added",
// //         description: `${user.name} is already a member of this project`,
// //         variant: "destructive"
// //       });
// //       return;
// //     }
    
// //     // Add user to project (in a real app, this would be an API call)
// //     toast({
// //       title: "Invitation sent",
// //       description: `Invitation has been sent to ${user.name}`
// //     });
    
// //     // Create notification for the invited user
// //     addNotification({
// //       type: 'invitation',
// //       message: `You've been invited to join the project "${project.title}"`,
// //       sender: {
// //         id: 'currentUser',
// //         name: 'Current User',
// //         avatar: ''
// //       },
// //       relatedProject: project.id
// //     });
    
// //     // Create collaborator object
// //     const newCollaborator = {
// //       id: Date.now().toString(),
// //       name: user.name,
// //       email: user.email,
// //       avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
// //       role: 'editor',
// //       addedAt: new Date().toISOString()
// //     };
    
// //     // Add as collaborator
// //     handleAddCollaborator(newCollaborator);
    
// //     // Clear search
// //     setSearchTerm('');
// //     setSearchResults([]);
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <Loader2 className="h-12 w-12 animate-spin text-primary" />
// //       </div>
// //     );
// //   }

// //   if (!project) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <h2 className="text-2xl font-bold mb-4">Project not found</h2>
// //           <Button onClick={handleGoBack}>Go Back to Projects</Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Format the due date
// //   const formatDate = (date) => {
// //     if (!date) return 'No date set';
// //     return new Intl.DateTimeFormat('en-US', { 
// //       year: 'numeric', 
// //       month: 'long', 
// //       day: 'numeric' 
// //     }).format(new Date(date));
// //   };

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <NavBar />
// //       <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
// //         <Button variant="outline" className="mb-6" onClick={handleGoBack}>
// //           <ArrowLeft className="mr-2 h-4 w-4" />
// //           Back to Projects
// //         </Button>
        
// //         <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
// //           <div>
// //             <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
// //             <p className="text-muted-foreground">{project.description}</p>
// //           </div>
          
// //           <div className="flex items-center gap-4">
// //             <div className="flex items-center gap-2">
// //               <CalendarDays className="h-5 w-5 text-muted-foreground" />
// //               <span>Due: {formatDate(project.dueDate)}</span>
// //             </div>
            
// //             <Sheet open={teamSheetOpen} onOpenChange={setTeamSheetOpen}>
// //               <SheetTrigger asChild>
// //                 <Button variant="outline" size="sm" className="gap-2">
// //                   <Users className="h-4 w-4" />
// //                   <span>Team</span>
// //                   <div className="flex -space-x-2">
// //                     {project.members && project.members.slice(0, 3).map((member, index) => (
// //                       <div 
// //                         key={member.id || index} 
// //                         className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background text-[10px]"
// //                       >
// //                         {member.name ? member.name.charAt(0) : `U${index}`}
// //                       </div>
// //                     ))}
// //                     {project.members && project.members.length > 3 && (
// //                       <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] border-2 border-background">
// //                         +{project.members.length - 3}
// //                       </div>
// //                     )}
// //                   </div>
// //                 </Button>
// //               </SheetTrigger>
// //               <SheetContent side="right">
// //                 <SheetHeader>
// //                   <SheetTitle>Project Team</SheetTitle>
// //                   <SheetDescription>
// //                     View team members and add new collaborators
// //                   </SheetDescription>
// //                 </SheetHeader>
                
// //                 <div className="py-6">
// //                   <div className="relative mb-6">
// //                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
// //                     <Input
// //                       placeholder="Search users by name or email..."
// //                       className="pl-8"
// //                       value={searchTerm}
// //                       onChange={(e) => handleSearch(e.target.value)}
// //                     />
// //                   </div>
                  
// //                   {/* Search results */}
// //                   {searchResults.length > 0 && (
// //                     <div className="mb-6 space-y-1 border rounded-md p-1">
// //                       <h3 className="px-2 pt-2 text-sm font-medium">Search Results</h3>
// //                       {searchResults.map(user => (
// //                         <div 
// //                           key={user.id}
// //                           className="p-2 hover:bg-accent rounded-md flex items-center justify-between"
// //                         >
// //                           <div className="flex items-center gap-2">
// //                             <Avatar className="h-8 w-8">
// //                               <AvatarImage src={user.avatar} />
// //                               <AvatarFallback>{user.name[0]}</AvatarFallback>
// //                             </Avatar>
// //                             <div>
// //                               <p className="text-sm font-medium">{user.name}</p>
// //                               <p className="text-xs text-muted-foreground">{user.email}</p>
// //                             </div>
// //                           </div>
// //                           <Button 
// //                             size="sm" 
// //                             variant="outline"
// //                             className="h-8 w-8 p-0"
// //                             onClick={() => handleAddUser(user)}
// //                           >
// //                             <UserPlus className="h-4 w-4" />
// //                           </Button>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}
                  
// //                   {/* Current team members */}
// //                   <div>
// //                     <h3 className="text-sm font-medium mb-3">Team Members</h3>
// //                     <div className="space-y-2">
// //                       {project.members && project.members.length > 0 ? (
// //                         project.members.map((member, index) => (
// //                           <div 
// //                             key={member.id || index}
// //                             className="p-2 bg-muted rounded-md flex items-center gap-2"
// //                           >
// //                             <Avatar className="h-8 w-8">
// //                               <AvatarImage src={member.avatar} />
// //                               <AvatarFallback>
// //                                 {member.name ? member.name.charAt(0) : `U${index}`}
// //                               </AvatarFallback>
// //                             </Avatar>
// //                             <div>
// //                               <p className="text-sm font-medium">{member.name}</p>
// //                               <p className="text-xs text-muted-foreground">{member.email || 'No email'}</p>
// //                             </div>
// //                           </div>
// //                         ))
// //                       ) : (
// //                         <p className="text-sm text-muted-foreground">No team members yet</p>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </SheetContent>
// //             </Sheet>
// //           </div>
// //         </div>
        
// //         <ProjectDetailTabs
// //           project={project}
// //           projectTasks={projectTasks}
// //           selectedFile={selectedFile}
// //           setSelectedFile={setSelectedFile}
// //           onSaveFile={handleSaveFile}
// //           onNewFileClick={() => setNewFileDialogOpen(true)}
// //           onCommitClick={() => setNewCommitDialogOpen(true)}
// //           onAddTaskClick={() => setNewTaskDialogOpen(true)}
// //           onAddMeetingClick={() => setNewMeetingDialogOpen(true)}
// //           onAddCollaborator={handleAddCollaborator}
// //           onRemoveCollaborator={handleRemoveCollaborator}
// //         />
        
// //         {/* Dialogs */}
// //         <NewFileDialog
// //           isOpen={newFileDialogOpen}
// //           onOpenChange={setNewFileDialogOpen}
// //           newFileName={newFileName}
// //           setNewFileName={setNewFileName}
// //           newFileType={newFileType}
// //           setNewFileType={setNewFileType}
// //           onAddFile={handleAddFile}
// //         />
        
// //         <NewMeetingDialog
// //           isOpen={newMeetingDialogOpen}
// //           onOpenChange={setNewMeetingDialogOpen}
// //           newMeeting={newMeeting}
// //           setNewMeeting={setNewMeeting}
// //           onAddMeeting={handleAddMeeting}
// //         />
        
// //         <NewTaskDialog
// //           isOpen={newTaskDialogOpen}
// //           onOpenChange={setNewTaskDialogOpen}
// //           newTask={newTask}
// //           setNewTask={setNewTask}
// //           onAddTask={handleAddTask}
// //         />
        
// //         <NewCommitDialog
// //           isOpen={newCommitDialogOpen}
// //           onOpenChange={setNewCommitDialogOpen}
// //           commitMessage={commitMessage}
// //           setCommitMessage={setCommitMessage}
// //           onAddCommit={handleAddCommit}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProjectDetail;






// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import NavBar from '@/components/NavBar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Loader2, ArrowLeft, CalendarDays, Users, Search, UserPlus, Trash2 } from 'lucide-react';
// import ProjectDetailTabs from '@/components/project/ProjectDetailTabs';
// import { NewFileDialog, NewMeetingDialog, NewTaskDialog, NewCommitDialog } from '@/components/project/ProjectDialogs';
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import useProjectDetail from '@/hooks/useProjectDetail';
// import { toast } from '@/hooks/use-toast';
// import { useNotifications } from '@/context/NotificationsContext';
// import { ProjectDetailLoading, ProjectNotFound } from '@/components/project/ProjectDetailLoading';

// const MOCK_USERS = [
//   { id: 'u1', name: 'John Doe', email: 'john@example.com', avatar: '' },
//   { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
//   { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
// ];

// const ProjectDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addNotification } = useNotifications();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [teamSheetOpen, setTeamSheetOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
//   // Extract the projectId from the URL params for clarity
//   const projectId = id;
  
//   const {
//     project,
//     isLoading,
//     selectedFile, 
//     setSelectedFile,
//     projectTasks,
//     newFileName, 
//     setNewFileName,
//     newFileType, 
//     setNewFileType,
//     newFileDialogOpen, 
//     setNewFileDialogOpen,
//     newMeetingDialogOpen, 
//     setNewMeetingDialogOpen,
//     newTaskDialogOpen, 
//     setNewTaskDialogOpen,
//     newCommitDialogOpen, 
//     setNewCommitDialogOpen,
//     commitMessage, 
//     setCommitMessage,
//     newMeeting, 
//     setNewMeeting,
//     newTask, 
//     setNewTask,
//     handleSaveFile,
//     handleAddFile,
//     handleAddCommit,
//     handleAddMeeting,
//     handleDeleteMeeting,
//     handleAddTask,
//     handleAddCollaborator,
//     handleRemoveCollaborator,
//     handleDeleteProject,
//     handleGoBack
//   } = useProjectDetail(projectId);

//   const handleSearch = (term) => {
//     setSearchTerm(term);
//     if (term.trim().length > 0) {
//       const results = MOCK_USERS.filter(user => 
//         user.name.toLowerCase().includes(term.toLowerCase()) ||
//         user.email.toLowerCase().includes(term.toLowerCase())
//       );
//       setSearchResults(results);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const handleAddUser = (user) => {
//     if (!project || !project.members) {
//       toast({
//         title: "Error",
//         description: "Project data is not available",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     const isMember = project.members.some(member => member.id === user.id);
    
//     if (isMember) {
//       toast({
//         title: "User already added",
//         description: `${user.name} is already a member of this project`,
//         variant: "destructive"
//       });
//       return;
//     }
    
//     toast({
//       title: "Invitation sent",
//       description: `Invitation has been sent to ${user.name}`
//     });
    
//     addNotification({
//       type: 'invitation',
//       message: `You've been invited to join the project "${project.title}"`,
//       sender: {
//         id: 'currentUser',
//         name: 'Current User',
//         avatar: ''
//       },
//       relatedProject: project.id
//     });
    
//     const newCollaborator = {
//       id: Date.now().toString(),
//       name: user.name,
//       email: user.email,
//       avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
//       role: 'editor',
//       addedAt: new Date().toISOString()
//     };
    
//     handleAddCollaborator(newCollaborator);
    
//     setSearchTerm('');
//     setSearchResults([]);
//   };

//   const confirmDeleteProject = () => {
//     handleDeleteProject();
//     setDeleteDialogOpen(false);
//     navigate('/dashboard');
//   };

//   if (isLoading) {
//     return <ProjectDetailLoading onGoBack={handleGoBack} />;
//   }

//   if (!project) {
//     return <ProjectNotFound onGoBack={handleGoBack} />;
//   }

//   const formatDate = (date) => {
//     if (!date) return 'No date set';
//     return new Intl.DateTimeFormat('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     }).format(new Date(date));
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <NavBar />
//       <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
//         <div className="flex justify-between items-center mb-6">
//           <Button variant="outline" onClick={handleGoBack}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Projects
//           </Button>
          
//           <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
//             <Trash2 className="mr-2 h-4 w-4" />
//             Delete Project
//           </Button>
//         </div>
        
//         <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
//             <p className="text-muted-foreground">{project.description}</p>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <div className="flex items-center gap-2">
//               <CalendarDays className="h-5 w-5 text-muted-foreground" />
//               <span>Due: {formatDate(project.dueDate)}</span>
//             </div>
            
//             <Sheet open={teamSheetOpen} onOpenChange={setTeamSheetOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="outline" size="sm" className="gap-2">
//                   <Users className="h-4 w-4" />
//                   <span>Team</span>
//                   <div className="flex -space-x-2">
//                     {project.members && project.members.slice(0, 3).map((member, index) => (
//                       <div 
//                         key={member.id || index} 
//                         className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background text-[10px]"
//                       >
//                         {member.name ? member.name.charAt(0) : `U${index}`}
//                       </div>
//                     ))}
//                     {project.members && project.members.length > 3 && (
//                       <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] border-2 border-background">
//                         +{project.members.length - 3}
//                       </div>
//                     )}
//                   </div>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="right">
//                 <SheetHeader>
//                   <SheetTitle>Project Team</SheetTitle>
//                   <SheetDescription>
//                     View team members and add new collaborators
//                   </SheetDescription>
//                 </SheetHeader>
                
//                 <div className="py-6">
//                   <div className="relative mb-6">
//                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search users by name or email..."
//                       className="pl-8"
//                       value={searchTerm}
//                       onChange={(e) => handleSearch(e.target.value)}
//                     />
//                   </div>
                  
//                   {searchResults.length > 0 && (
//                     <div className="mb-6 space-y-1 border rounded-md p-1">
//                       <h3 className="px-2 pt-2 text-sm font-medium">Search Results</h3>
//                       {searchResults.map(user => (
//                         <div 
//                           key={user.id}
//                           className="p-2 hover:bg-accent rounded-md flex items-center justify-between"
//                         >
//                           <div className="flex items-center gap-2">
//                             <Avatar className="h-8 w-8">
//                               <AvatarImage src={user.avatar} />
//                               <AvatarFallback>{user.name[0]}</AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <p className="text-sm font-medium">{user.name}</p>
//                               <p className="text-xs text-muted-foreground">{user.email}</p>
//                             </div>
//                           </div>
//                           <Button 
//                             size="sm" 
//                             variant="outline"
//                             className="h-8 w-8 p-0"
//                             onClick={() => handleAddUser(user)}
//                           >
//                             <UserPlus className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
                  
//                   <div>
//                     <h3 className="text-sm font-medium mb-3">Team Members</h3>
//                     <div className="space-y-2">
//                       {project.members && project.members.length > 0 ? (
//                         project.members.map((member, index) => (
//                           <div 
//                             key={member.id || index}
//                             className="p-2 bg-muted rounded-md flex items-center gap-2"
//                           >
//                             <Avatar className="h-8 w-8">
//                               <AvatarImage src={member.avatar} />
//                               <AvatarFallback>
//                                 {member.name ? member.name.charAt(0) : `U${index}`}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div>
//                               <p className="text-sm font-medium">{member.name}</p>
//                               <p className="text-xs text-muted-foreground">{member.email || 'No email'}</p>
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-sm text-muted-foreground">No team members yet</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//         </div>
        
//         <ProjectDetailTabs
//           project={project}
//           projectTasks={projectTasks}
//           selectedFile={selectedFile}
//           setSelectedFile={setSelectedFile}
//           onSaveFile={handleSaveFile}
//           onNewFileClick={() => setNewFileDialogOpen(true)}
//           onCommitClick={() => setNewCommitDialogOpen(true)}
//           onAddTaskClick={() => setNewTaskDialogOpen(true)}
//           onAddMeetingClick={() => setNewMeetingDialogOpen(true)}
//           onDeleteMeeting={handleDeleteMeeting}
//           onAddCollaborator={handleAddCollaborator}
//           onRemoveCollaborator={handleRemoveCollaborator}
//         />
        
//         <NewFileDialog
//           isOpen={newFileDialogOpen}
//           onOpenChange={setNewFileDialogOpen}
//           newFileName={newFileName}
//           setNewFileName={setNewFileName}
//           newFileType={newFileType}
//           setNewFileType={setNewFileType}
//           onAddFile={handleAddFile}
//         />
        
//         <NewMeetingDialog
//           isOpen={newMeetingDialogOpen}
//           onOpenChange={setNewMeetingDialogOpen}
//           newMeeting={newMeeting}
//           setNewMeeting={setNewMeeting}
//           onAddMeeting={handleAddMeeting}
//         />
        
//         <NewTaskDialog
//           isOpen={newTaskDialogOpen}
//           onOpenChange={setNewTaskDialogOpen}
//           newTask={newTask}
//           setNewTask={setNewTask}
//           onAddTask={handleAddTask}
//         />
        
//         <NewCommitDialog
//           isOpen={newCommitDialogOpen}
//           onOpenChange={setNewCommitDialogOpen}
//           commitMessage={commitMessage}
//           setCommitMessage={setCommitMessage}
//           onAddCommit={handleAddCommit}
//         />
        
//         <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. All project data, files, meetings, and tasks will be permanently deleted.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction variant="destructive" onClick={confirmDeleteProject}>
//                 Delete Project
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetail;




import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, CalendarDays, Users, Search, UserPlus, Trash2 } from 'lucide-react';
import ProjectDetailTabs from '@/components/project/ProjectDetailTabs';
import { NewFileDialog, NewMeetingDialog, NewTaskDialog, NewCommitDialog } from '@/components/project/ProjectDialogs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useProjectDetail from '@/hooks/useProjectDetail';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/context/NotificationsContext';
import { ProjectDetailLoading, ProjectNotFound } from '@/components/project/ProjectDetailLoading';

const MOCK_USERS = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', avatar: '' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
  { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [teamSheetOpen, setTeamSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Extract the projectId from the URL params for clarity
  const projectId = id;
  
  const {
    project,
    isLoading,
    selectedFile, 
    setSelectedFile,
    projectTasks,
    newFileName, 
    setNewFileName,
    newFileType, 
    setNewFileType,
    newFileDialogOpen, 
    setNewFileDialogOpen,
    newMeetingDialogOpen, 
    setNewMeetingDialogOpen,
    newTaskDialogOpen, 
    setNewTaskDialogOpen,
    newCommitDialogOpen, 
    setNewCommitDialogOpen,
    commitMessage, 
    setCommitMessage,
    newMeeting, 
    setNewMeeting,
    newTask, 
    setNewTask,
    handleSaveFile,
    handleAddFile,
    handleAddCommit,
    handleAddMeeting,
    handleDeleteMeeting,
    handleAddTask,
    handleAddCollaborator,
    handleRemoveCollaborator,
    handleDeleteProject,
    handleGoBack
  } = useProjectDetail(projectId);

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim().length > 0) {
      const results = MOCK_USERS.filter(user => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddUser = (user) => {
    if (!project || !project.members) {
      toast({
        title: "Error",
        description: "Project data is not available",
        variant: "destructive"
      });
      return;
    }
    
    // Ensure members is an array
    const membersArray = Array.isArray(project.members) ? project.members : [];
    
    const isMember = membersArray.some(member => member.id === user.id);
    
    if (isMember) {
      toast({
        title: "User already added",
        description: `${user.name} is already a member of this project`,
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invitation sent",
      description: `Invitation has been sent to ${user.name}`
    });
    
    addNotification({
      type: 'invitation',
      message: `You've been invited to join the project "${project.title}"`,
      sender: {
        id: 'currentUser',
        name: 'Current User',
        avatar: ''
      },
      relatedProject: project.id
    });
    
    const newCollaborator = {
      id: Date.now().toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      role: 'editor',
      addedAt: new Date().toISOString()
    };
    
    handleAddCollaborator(newCollaborator);
    
    setSearchTerm('');
    setSearchResults([]);
  };

  const confirmDeleteProject = () => {
    handleDeleteProject();
    setDeleteDialogOpen(false);
    navigate('/dashboard');
  };

  if (isLoading) {
    return <ProjectDetailLoading onGoBack={handleGoBack} />;
  }

  if (!project) {
    return <ProjectNotFound onGoBack={handleGoBack} />;
  }

  // Ensure members is an array for rendering
  const membersArray = Array.isArray(project.members) ? project.members : [];

  const formatDate = (date) => {
    if (!date) return 'No date set';
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Project
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <span>Due: {formatDate(project.dueDate)}</span>
            </div>
            
            <Sheet open={teamSheetOpen} onOpenChange={setTeamSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  <span>Team</span>
                  <div className="flex -space-x-2">
                    {membersArray.slice(0, 3).map((member, index) => (
                      <div 
                        key={member.id || index} 
                        className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background text-[10px]"
                      >
                        {member.name ? member.name.charAt(0) : `U${index}`}
                      </div>
                    ))}
                    {membersArray.length > 3 && (
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[10px] border-2 border-background">
                        +{membersArray.length - 3}
                      </div>
                    )}
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Project Team</SheetTitle>
                  <SheetDescription>
                    View team members and add new collaborators
                  </SheetDescription>
                </SheetHeader>
                
                <div className="py-6">
                  <div className="relative mb-6">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name or email..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="mb-6 space-y-1 border rounded-md p-1">
                      <h3 className="px-2 pt-2 text-sm font-medium">Search Results</h3>
                      {searchResults.map(user => (
                        <div 
                          key={user.id}
                          className="p-2 hover:bg-accent rounded-md flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => handleAddUser(user)}
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Team Members</h3>
                    <div className="space-y-2">
                      {membersArray.length > 0 ? (
                        membersArray.map((member, index) => (
                          <div 
                            key={member.id || index}
                            className="p-2 bg-muted rounded-md flex items-center gap-2"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name ? member.name.charAt(0) : `U${index}`}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.email || 'No email'}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No team members yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <ProjectDetailTabs
          project={{
            ...project,
            members: membersArray, // Ensure members is always an array
            collaborators: Array.isArray(project.collaborators) ? project.collaborators : []
          }}
          projectTasks={projectTasks}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSaveFile={handleSaveFile}
          onNewFileClick={() => setNewFileDialogOpen(true)}
          onCommitClick={() => setNewCommitDialogOpen(true)}
          onAddTaskClick={() => setNewTaskDialogOpen(true)}
          onAddMeetingClick={() => setNewMeetingDialogOpen(true)}
          onDeleteMeeting={handleDeleteMeeting}
          onAddCollaborator={handleAddCollaborator}
          onRemoveCollaborator={handleRemoveCollaborator}
        />
        
        <NewFileDialog
          isOpen={newFileDialogOpen}
          onOpenChange={setNewFileDialogOpen}
          newFileName={newFileName}
          setNewFileName={setNewFileName}
          newFileType={newFileType}
          setNewFileType={setNewFileType}
          onAddFile={handleAddFile}
        />
        
        <NewMeetingDialog
          isOpen={newMeetingDialogOpen}
          onOpenChange={setNewMeetingDialogOpen}
          newMeeting={newMeeting}
          setNewMeeting={setNewMeeting}
          onAddMeeting={handleAddMeeting}
        />
        
        <NewTaskDialog
          isOpen={newTaskDialogOpen}
          onOpenChange={setNewTaskDialogOpen}
          newTask={newTask}
          setNewTask={setNewTask}
          onAddTask={handleAddTask}
        />
        
        <NewCommitDialog
          isOpen={newCommitDialogOpen}
          onOpenChange={setNewCommitDialogOpen}
          commitMessage={commitMessage}
          setCommitMessage={setCommitMessage}
          onAddCommit={handleAddCommit}
        />
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. All project data, files, meetings, and tasks will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={confirmDeleteProject}>
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProjectDetail;