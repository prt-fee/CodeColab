
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

// Split out components for better maintainability
const ProjectStatusCard = ({ project }) => {
  const getStatusColor = () => {
    const status = project?.status || 'active';
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'delayed': return 'bg-amber-500';
      case 'at-risk': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Project Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {project?.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Active'}
          </span>
          <span className={`h-4 w-4 rounded-full ${getStatusColor()}`}></span>
        </div>
      </CardContent>
    </Card>
  );
};

const TaskCompletionCard = ({ projectTasks }) => {
  const total = projectTasks?.length || 0;
  const completed = projectTasks?.filter(task => task.status === 'completed')?.length || 0;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{percentage}%</div>
        <p className="text-xs text-muted-foreground">
          {completed} of {total} tasks completed
        </p>
        <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

const TeamProductivityCard = ({ project }) => {
  // Mock data for team productivity when real data isn't available
  const mockProductivityData = [
    { name: 'Week 1', productivity: 30 },
    { name: 'Week 2', productivity: 45 },
    { name: 'Week 3', productivity: 40 },
    { name: 'Week 4', productivity: 60 },
    { name: 'Week 5', productivity: 55 },
    { name: 'Week 6', productivity: 75 },
  ];

  const productivityData = project?.productivityData || mockProductivityData;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Team Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={productivityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const TaskDistributionCard = ({ projectTasks }) => {
  // Process task data or use fallbacks
  const generateTaskTypeData = () => {
    const tasks = projectTasks || [];
    
    if (tasks.length === 0) {
      return [
        { name: 'Feature', value: 5 },
        { name: 'Bug', value: 3 },
        { name: 'Documentation', value: 2 },
        { name: 'Testing', value: 4 }
      ];
    }
    
    const typeCount = tasks.reduce((acc, task) => {
      const type = task.type || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  };

  const data = generateTaskTypeData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Task Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const TimelineProgressCard = ({ project }) => {
  // Generate mock timeline data
  const generateTimelineData = () => {
    if (project?.timeline) return project.timeline;
    
    return [
      { name: 'Planning', planned: 10, actual: 12 },
      { name: 'Design', planned: 15, actual: 15 },
      { name: 'Development', planned: 25, actual: 20 },
      { name: 'Testing', planned: 10, actual: 5 },
      { name: 'Deployment', planned: 10, actual: 0 },
    ];
  };

  const data = generateTimelineData();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="planned" fill="#8884d8" name="Planned Time (days)" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual Time (days)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const BurndownChartCard = ({ project }) => {
  // Generate mock burndown data if real data isn't available
  const generateBurndownData = () => {
    if (project?.burndown) return project.burndown;
    
    return [
      { name: 'Week 1', remaining: 100, ideal: 90 },
      { name: 'Week 2', remaining: 85, ideal: 80 },
      { name: 'Week 3', remaining: 75, ideal: 70 },
      { name: 'Week 4', remaining: 70, ideal: 60 },
      { name: 'Week 5', remaining: 55, ideal: 50 },
      { name: 'Week 6', remaining: 45, ideal: 40 },
      { name: 'Week 7', remaining: 35, ideal: 30 },
      { name: 'Week 8', remaining: 20, ideal: 20 },
      { name: 'Week 9', remaining: 15, ideal: 10 },
      { name: 'Week 10', remaining: 5, ideal: 0 },
    ];
  };

  const data = generateBurndownData();

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Burndown Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="remaining" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
              name="Remaining Work"
            />
            <Area 
              type="monotone" 
              dataKey="ideal" 
              stroke="#82ca9d" 
              fill="none"
              name="Ideal Burndown"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Main component
const StatsPanel = ({ project, projectTasks }) => {
  if (!project) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No project data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProjectStatusCard project={project} />
        <TaskCompletionCard projectTasks={projectTasks} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Project Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {project.duration || '10 weeks'}
            </div>
            <p className="text-xs text-muted-foreground">
              {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Unknown'} - 
              {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Ongoing'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TeamProductivityCard project={project} />
        <TaskDistributionCard projectTasks={projectTasks} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimelineProgressCard project={project} />
        <BurndownChartCard project={project} />
      </div>
    </div>
  );
};

export default StatsPanel;
