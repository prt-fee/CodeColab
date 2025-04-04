
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Users, Trash2 } from 'lucide-react';

const ProjectHeader = ({ 
  project, 
  membersArray, 
  formatDate, 
  onGoBack, 
  onDeleteClick, 
  onTeamClick 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        
        <Button variant="destructive" onClick={onDeleteClick}>
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
          
          <Button variant="outline" size="sm" className="gap-2" onClick={onTeamClick}>
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
        </div>
      </div>
    </>
  );
};

export default ProjectHeader;
