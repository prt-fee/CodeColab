
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, ChevronRight, PieChart, 
  Clock, CheckCircle, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/TaskCard';
import ProjectCard, { Project } from '@/components/ProjectCard';
import { useTaskManager } from '@/hooks/useTaskManager';
import { staggerAnimation } from '@/lib/animations';

// Sample projects data
const projects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Redesign the company website with new branding',
    dueDate: new Date('2023-06-20'),
    members: 4,
    tasksCount: { total: 12, completed: 8 }
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a new mobile app for client',
    dueDate: new Date('2023-07-15'),
    members: 6,
    tasksCount: { total: 24, completed: 5 }
  }
];

const Dashboard: React.FC = () => {
  const { tasks, isLoading } = useTaskManager();
  const navigate = useNavigate();
  
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Animate sections
    if (sectionsRef.current.length > 0) {
      staggerAnimation(sectionsRef.current, 0.1, 0.5);
    }
  }, []);

  // Get recent tasks (last 4)
  const recentTasks = [...tasks]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 4);
  
  // Count tasks by status
  const taskCounts = {
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length
  };

  return (
    <div className="space-y-6">
      {/* Stats section */}
      <div 
        ref={el => el && (sectionsRef.current[0] = el)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 opacity-0"
      >
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <h3 className="text-2xl font-semibold mt-1">{taskCounts.total}</h3>
            </div>
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <PieChart size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            All active tasks in your projects
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">To Do</p>
              <h3 className="text-2xl font-semibold mt-1">{taskCounts.todo}</h3>
            </div>
            <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Tasks waiting to be started
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <h3 className="text-2xl font-semibold mt-1">{taskCounts.inProgress}</h3>
            </div>
            <div className="w-10 h-10 rounded-md bg-amber-50 flex items-center justify-center text-amber-500">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Tasks currently being worked on
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <h3 className="text-2xl font-semibold mt-1">{taskCounts.completed}</h3>
            </div>
            <div className="w-10 h-10 rounded-md bg-green-50 flex items-center justify-center text-green-500">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Successfully completed tasks
          </div>
        </div>
      </div>
      
      {/* Recent Tasks */}
      <div 
        ref={el => el && (sectionsRef.current[1] = el)}
        className="bg-white rounded-lg border shadow-sm p-5 opacity-0"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">Recent Tasks</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm"
            onClick={() => navigate('/tasks')}
          >
            View all
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <p className="text-muted-foreground col-span-4 text-center py-8">Loading tasks...</p>
          ) : recentTasks.length > 0 ? (
            recentTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onClick={() => navigate(`/tasks/${task.id}`)} 
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-4 text-center py-8">No tasks found</p>
          )}
        </div>
      </div>
      
      {/* Projects */}
      <div 
        ref={el => el && (sectionsRef.current[2] = el)}
        className="bg-white rounded-lg border shadow-sm p-5 opacity-0"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">Active Projects</h2>
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm" 
            onClick={() => navigate('/projects')}
          >
            View all
            <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => navigate(`/projects/${project.id}`)} 
            />
          ))}
        </div>
      </div>
      
      {/* Upcoming section */}
      <div 
        ref={el => el && (sectionsRef.current[3] = el)}
        className="bg-white rounded-lg border shadow-sm p-5 opacity-0"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-lg">Upcoming</h2>
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm"
            onClick={() => navigate('/calendar')}
          >
            Calendar
            <Calendar size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="text-center py-6">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-3">
            <Calendar size={24} />
          </div>
          <h3 className="text-lg font-medium mb-1">Your schedule is clear</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            You have no upcoming meetings or deadlines in the next few days.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/calendar')}>
            Schedule a meeting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
