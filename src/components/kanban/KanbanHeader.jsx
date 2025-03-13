
import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const KanbanHeader = ({ completionRate, openNewTaskDialog }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Kanban Board</h1>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
          {completionRate}% Complete
        </Badge>
        <Button onClick={openNewTaskDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default KanbanHeader;
