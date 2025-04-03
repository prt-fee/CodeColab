
// // import React from 'react';
// // import { Plus } from 'lucide-react';

// // const ProjectCard = ({ project, onClick }) => {
// //   const progress = project.tasksCount.total > 0 
// //     ? Math.round((project.tasksCount.completed / project.tasksCount.total) * 100) 
// //     : 0;

// //   const formatDate = (date) => {
// //     if (!date) return '';
// //     return new Intl.DateTimeFormat('en-US', { 
// //       month: 'short', 
// //       day: 'numeric' 
// //     }).format(new Date(date));
// //   };

// //   const getColorClasses = (color) => {
// //     switch (color) {
// //       case 'blue':
// //         return 'bg-blue-100 text-blue-500';
// //       case 'green':
// //         return 'bg-green-100 text-green-500';
// //       case 'orange':
// //         return 'bg-orange-100 text-orange-500';
// //       case 'red':
// //         return 'bg-red-100 text-red-500';
// //       case 'purple':
// //         return 'bg-purple-100 text-purple-500';
// //       default:
// //         return 'bg-primary-100 text-primary-500';
// //     }
// //   };

// //   return (
// //     <div
// //       onClick={() => onClick(project.id)}
// //       className="bg-white rounded-lg border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30"
// //     >
// //       <div className="flex items-center gap-3 mb-3">
// //         <div 
// //           className={`w-10 h-10 rounded-md flex items-center justify-center ${getColorClasses(project.color)}`}
// //         >
// //           <Plus size={20} />
// //         </div>
// //         <div>
// //           <h3 className="font-medium text-base">{project.title}</h3>
// //           {project.dueDate && (
// //             <p className="text-xs text-muted-foreground">
// //               Due {formatDate(project.dueDate)}
// //             </p>
// //           )}
// //         </div>
// //       </div>
      
// //       {project.description && (
// //         <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
// //           {project.description}
// //         </p>
// //       )}
      
// //       <div className="mb-3">
// //         <div className="flex justify-between items-center mb-1">
// //           <span className="text-xs text-muted-foreground">Progress</span>
// //           <span className="text-xs font-medium">{progress}%</span>
// //         </div>
// //         <div className="w-full bg-secondary rounded-full h-1.5">
// //           <div 
// //             className="bg-primary h-1.5 rounded-full" 
// //             style={{ width: `${progress}%` }}
// //           ></div>
// //         </div>
// //       </div>
      
// //       <div className="flex items-center justify-between mt-4 text-muted-foreground text-xs">
// //         <div className="flex items-center gap-1">
// //           <span>{typeof project.members === 'number' ? project.members : (project.members?.length || 0)} members</span>
// //         </div>
        
// //         <div className="flex items-center gap-1">
// //           <span>{project.tasksCount.completed}/{project.tasksCount.total} tasks</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProjectCard;


// import React from 'react';
// import { Plus, Trash2 } from 'lucide-react';

// const ProjectCard = ({ project, onClick, onDelete }) => {
//   const progress = project.tasksCount.total > 0 
//     ? Math.round((project.tasksCount.completed / project.tasksCount.total) * 100) 
//     : 0;

//   const formatDate = (date) => {
//     if (!date) return '';
//     return new Intl.DateTimeFormat('en-US', { 
//       month: 'short', 
//       day: 'numeric' 
//     }).format(new Date(date));
//   };

//   const getColorClasses = (color) => {
//     switch (color) {
//       case 'blue':
//         return 'bg-blue-100 text-blue-500';
//       case 'green':
//         return 'bg-green-100 text-green-500';
//       case 'orange':
//         return 'bg-orange-100 text-orange-500';
//       case 'red':
//         return 'bg-red-100 text-red-500';
//       case 'purple':
//         return 'bg-purple-100 text-purple-500';
//       default:
//         return 'bg-primary-100 text-primary-500';
//     }
//   };

//   // Handle delete button click
//   const handleDelete = (e) => {
//     e.stopPropagation(); // Prevent the card's onClick from firing
//     if (onDelete) {
//       onDelete(project.id);
//     }
//   };

//   return (
//     <div
//       className="bg-white rounded-lg border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 relative"
//     >
//       {/* Delete button positioned in top-right corner */}
//       <button
//         onClick={handleDelete}
//         className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
//         aria-label="Delete project"
//       >
//         <Trash2 size={16} />
//       </button>
      
//       <div 
//         onClick={() => onClick(project.id)}
//         className="w-full h-full"
//       >
//         <div className="flex items-center gap-3 mb-3">
//           <div 
//             className={`w-10 h-10 rounded-md flex items-center justify-center ${getColorClasses(project.color)}`}
//           >
//             <Plus size={20} />
//           </div>
//           <div>
//             <h3 className="font-medium text-base">{project.title}</h3>
//             {project.dueDate && (
//               <p className="text-xs text-muted-foreground">
//                 Due {formatDate(project.dueDate)}
//               </p>
//             )}
//           </div>
//         </div>
        
//         {project.description && (
//           <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//             {project.description}
//           </p>
//         )}
        
//         <div className="mb-3">
//           <div className="flex justify-between items-center mb-1">
//             <span className="text-xs text-muted-foreground">Progress</span>
//             <span className="text-xs font-medium">{progress}%</span>
//           </div>
//           <div className="w-full bg-secondary rounded-full h-1.5">
//             <div 
//               className="bg-primary h-1.5 rounded-full" 
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>
//         </div>
        
//         <div className="flex items-center justify-between mt-4 text-muted-foreground text-xs">
//           <div className="flex items-center gap-1">
//             <span>{typeof project.members === 'number' ? project.members : (project.members?.length || 0)} members</span>
//           </div>
          
//           <div className="flex items-center gap-1">
//             <span>{project.tasksCount.completed}/{project.tasksCount.total} tasks</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;



import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onClick, onDelete }) => {
  // Handle cases where tasksCount might be missing or incomplete
  const tasksTotal = project.tasksCount?.total || 0;
  const tasksCompleted = project.tasksCount?.completed || 0;
  const progress = tasksTotal > 0 
    ? Math.round((tasksCompleted / tasksTotal) * 100) 
    : 0;

  const formatDate = (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(new Date(date));
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-500';
      case 'green':
        return 'bg-green-100 text-green-500';
      case 'orange':
        return 'bg-orange-100 text-orange-500';
      case 'red':
        return 'bg-red-100 text-red-500';
      case 'purple':
        return 'bg-purple-100 text-purple-500';
      default:
        return 'bg-primary-100 text-primary-500';
    }
  };

  // Handle delete button click
  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    if (onDelete) {
      onDelete(project.id);
    }
  };

  // Get members count safely whether members is an array or a number
  const getMembersCount = () => {
    if (typeof project.members === 'number') return project.members;
    if (Array.isArray(project.members)) return project.members.length;
    return 0;
  };

  return (
    <div
      className="bg-white rounded-lg border shadow-sm p-5 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 relative"
    >
      {/* Delete button positioned in top-right corner */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        aria-label="Delete project"
      >
        <Trash2 size={16} />
      </button>
      
      <div 
        onClick={() => onClick(project.id)}
        className="w-full h-full"
      >
        <div className="flex items-center gap-3 mb-3">
          <div 
            className={`w-10 h-10 rounded-md flex items-center justify-center ${getColorClasses(project.color)}`}
          >
            <Plus size={20} />
          </div>
          <div>
            <h3 className="font-medium text-base">{project.title}</h3>
            {project.dueDate && (
              <p className="text-xs text-muted-foreground">
                Due {formatDate(project.dueDate)}
              </p>
            )}
          </div>
        </div>
        
        {project.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-muted-foreground text-xs">
          <div className="flex items-center gap-1">
            <span>{getMembersCount()} members</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span>{tasksCompleted}/{tasksTotal} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;