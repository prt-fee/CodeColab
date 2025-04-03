
// // import React from 'react';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Plus } from 'lucide-react';
// // import ProjectCard from './ProjectCard';

// // const ProjectsList = ({ projects, onCreateClick, onProjectClick }) => {
// //   return (
// //     <div className="mb-12">
// //       <div className="flex items-center justify-between mb-6">
// //         <h2 className="text-2xl font-bold">Your Projects</h2>
// //         <Button onClick={onCreateClick}>
// //           <Plus className="mr-2 h-4 w-4" />
// //           New Project
// //         </Button>
// //       </div>
      
// //       {projects.length === 0 ? (
// //         <Card className="text-center py-8">
// //           <CardContent>
// //             <p className="text-muted-foreground mb-4">You don't have any projects yet</p>
// //             <Button onClick={onCreateClick}>
// //               <Plus className="mr-2 h-4 w-4" />
// //               Create Your First Project
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       ) : (
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {projects.map((project) => (
// //             <ProjectCard 
// //               key={project.id} 
// //               project={project} 
// //               onClick={() => onProjectClick(project.id)}
// //             />
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ProjectsList;





// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import ProjectCard from './ProjectCard';

// const ProjectsList = ({ projects, onCreateClick, onProjectClick, onDeleteProject }) => {
//   return (
//     <div className="mb-12">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">Your Projects</h2>
//         <Button onClick={onCreateClick}>
//           <Plus className="mr-2 h-4 w-4" />
//           New Project
//         </Button>
//       </div>
      
//       {projects.length === 0 ? (
//         <Card className="text-center py-8">
//           <CardContent>
//             <p className="text-muted-foreground mb-4">You don't have any projects yet</p>
//             <Button onClick={onCreateClick}>
//               <Plus className="mr-2 h-4 w-4" />
//               Create Your First Project
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map((project) => (
//             <ProjectCard
//               key={project.id}
//               project={project}
//               onClick={() => onProjectClick(project.id)}
//               onDelete={onDeleteProject}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectsList;







import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProjectCard from './ProjectCard';

const ProjectsList = ({ projects, onCreateClick, onProjectClick, onDeleteProject }) => {
  // Ensure projects is always an array
  const safeProjects = Array.isArray(projects) ? projects : [];
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>
      
      {safeProjects.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground mb-4">You don't have any projects yet</p>
            <Button onClick={onCreateClick}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectClick(project.id)}
              onDelete={() => onDeleteProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;