
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format, addDays } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

// Generate sample data for burndown chart
const generateBurndownData = (totalTasks, daysLeft) => {
  const data = [];
  const ideal = [];
  const actual = [];
  
  // Initial values
  let idealRemaining = totalTasks;
  let actualRemaining = totalTasks;
  const idealDecrement = totalTasks / daysLeft;
  
  for (let i = 0; i <= daysLeft; i++) {
    const date = format(addDays(new Date(), i), 'MMM dd');
    
    // Ideal burndown decreases linearly
    idealRemaining = Math.max(0, totalTasks - (idealDecrement * i));
    
    // Actual burndown (simulated with some randomness)
    if (i > 0) {
      const randomProgress = Math.random() * 1.5;
      actualRemaining = Math.max(0, actualRemaining - randomProgress);
    }
    
    data.push({
      date,
      Ideal: Math.round(idealRemaining),
      Actual: Math.round(actualRemaining),
    });
    
    ideal.push({ date, value: Math.round(idealRemaining) });
    actual.push({ date, value: Math.round(actualRemaining) });
  }
  
  return { data, ideal, actual };
};

// Sample data for project resource allocation
const generateResourceData = (resources) => {
  return resources.map(resource => ({
    name: resource.name,
    tasks: resource.tasks,
    fill: resource.color,
  }));
};

const TaskStatusChart = ({ statusCounts, totalTasks }) => {
  const data = [
    { name: 'Todo', value: statusCounts.todo || 0, fill: '#3b82f6' },
    { name: 'In Progress', value: statusCounts.inProgress || 0, fill: '#f59e0b' },
    { name: 'Completed', value: statusCounts.completed || 0, fill: '#10b981' },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TaskPriorityChart = ({ priorityCounts, totalTasks }) => {
  const data = [
    { name: 'Low', value: priorityCounts.low || 0, fill: '#3b82f6' },
    { name: 'Medium', value: priorityCounts.medium || 0, fill: '#f59e0b' },
    { name: 'High', value: priorityCounts.high || 0, fill: '#ef4444' },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const BurndownChart = ({ project }) => {
  const totalTasks = project?.tasksCount?.total || 10;
  const daysLeft = 30; // Sample days left in the project
  
  // Generate burndown data
  const { data } = generateBurndownData(totalTasks, daysLeft);
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="Ideal"
            stroke="#8884d8"
            strokeDasharray="5 5"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="Actual"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const ResourceAllocationChart = () => {
  // Sample resource data
  const resourceData = generateResourceData([
    { name: 'Development', tasks: 12, color: '#3b82f6' },
    { name: 'Design', tasks: 8, color: '#f59e0b' },
    { name: 'QA', tasks: 5, color: '#10b981' },
    { name: 'Marketing', tasks: 3, color: '#8b5cf6' },
  ]);
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={resourceData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="tasks"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {resourceData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const ProjectProgressBar = ({ project }) => {
  const progressPercentage = project?.tasksCount?.total > 0 
    ? Math.round((project?.tasksCount?.completed / project?.tasksCount?.total) * 100) 
    : 0;
    
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-muted-foreground">Overall Progress</span>
        <span className="text-sm font-medium">{progressPercentage}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const OverdueTasksTable = ({ projectTasks }) => {
  const overdueTasks = (projectTasks || []).filter(task => 
    new Date(task.dueDate) < new Date() && task.status !== 'completed'
  ).slice(0, 5); // Show only first 5 overdue tasks
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-4">Task ID</th>
            <th className="text-left py-2 px-4">Task</th>
            <th className="text-left py-2 px-4">Status</th>
            <th className="text-left py-2 px-4">Overdue by</th>
            <th className="text-left py-2 px-4">Assignee</th>
          </tr>
        </thead>
        <tbody>
          {overdueTasks.length > 0 ? (
            overdueTasks.map((task, index) => {
              const daysOverdue = Math.ceil(
                (new Date() - new Date(task.dueDate)) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <tr key={task.id || index} className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">#{String(index + 1).padStart(3, '0')}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-sm mr-2">
                        {format(new Date(task.dueDate), 'MMM dd')}
                      </span>
                      {task.title}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <span className="capitalize">{task.status === 'in-progress' ? 'In Progress' : task.status}</span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-red-500 font-medium">{daysOverdue} days</span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-muted-foreground">-</span>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-center text-muted-foreground">
                No overdue tasks
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const StatsPanel = ({ project, projectTasks }) => {
  // Ensure project and projectTasks are defined with fallbacks
  const safeProject = project || { 
    tasksCount: { total: 0, completed: 0 }, 
    dueDate: new Date(), 
    members: [] 
  };
  
  const safeProjectTasks = projectTasks || [];
  
  // Calculate task status counts for charts
  const statusCounts = {
    todo: safeProjectTasks.filter(task => task.status === 'todo').length,
    inProgress: safeProjectTasks.filter(task => task.status === 'in-progress').length,
    completed: safeProjectTasks.filter(task => task.status === 'completed').length
  };

  // Calculate priority counts for charts
  const priorityCounts = {
    low: safeProjectTasks.filter(task => task.priority === 'low').length,
    medium: safeProjectTasks.filter(task => task.priority === 'medium').length,
    high: safeProjectTasks.filter(task => task.priority === 'high').length
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium mb-1">Manager:</h3>
              <p className="text-muted-foreground">Aditi Goel</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Category:</h3>
              <p className="text-muted-foreground">Uncategorized</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Start date:</h3>
              <p className="text-muted-foreground">
                {format(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), 'MMM dd')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">End date:</h3>
              <p className="text-muted-foreground">
                {format(new Date(safeProject.dueDate || new Date()), 'MMM dd')}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Status:</h3>
              <p className="text-muted-foreground">Active</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Created by:</h3>
              <p className="text-muted-foreground">Aditi Goel</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 mb-1">Project status:</div>
              <div className="text-2xl font-bold">
                {Math.round((safeProject.tasksCount.completed / Math.max(safeProject.tasksCount.total, 1)) * 100)}% Completed
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 mb-1">Tasks:</div>
              <div className="text-2xl font-bold">
                {safeProject.tasksCount.completed} / {safeProject.tasksCount.total} Total
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 mb-1">Milestones:</div>
              <div className="text-2xl font-bold">1 Open / 1 Total</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 mb-1">People assigned:</div>
              <div className="text-2xl font-bold">
                {Array.isArray(safeProject.members) ? safeProject.members.length : 0} Assigned
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Project Timeline</h3>
            <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0">
                <div className="h-full flex items-center">
                  <div className="h-0.5 w-full bg-gray-300 relative">
                    {/* Today marker */}
                    <div className="absolute top-0 left-1/3 -translate-x-1/2 h-8 w-0.5 bg-blue-600"></div>
                    <div className="absolute -top-7 left-1/3 -translate-x-1/2 text-xs text-blue-600 whitespace-nowrap">Today {format(new Date(), 'MMM dd')}</div>
                    
                    {/* Start marker */}
                    <div className="absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-green-500 bg-white"></div>
                    <div className="absolute top-6 left-0 -translate-x-1/2 text-xs text-green-600 whitespace-nowrap">Starts {format(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), 'MMM dd')}</div>
                    
                    {/* End marker */}
                    <div className="absolute top-0 right-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-red-500 bg-white"></div>
                    <div className="absolute top-6 right-0 translate-x-1/2 text-xs text-red-600 whitespace-nowrap">Ends {format(new Date(safeProject.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)), 'MMM dd')}</div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full pt-2">
                  <div className="flex justify-between px-2 text-xs text-gray-500">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Apr</div>
                    <div>May</div>
                    <div>Jun</div>
                    <div>Jul</div>
                    <div>Aug</div>
                    <div>Sep</div>
                    <div>Oct</div>
                    <div>Nov</div>
                    <div>Dec</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskStatusChart 
              statusCounts={statusCounts} 
              totalTasks={safeProjectTasks.length} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Task Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskPriorityChart 
              priorityCounts={priorityCounts} 
              totalTasks={safeProjectTasks.length} 
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Burn-up Chart - Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <BurndownChart project={safeProject} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tasks By Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <ResourceAllocationChart />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Overdue Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <OverdueTasksTable projectTasks={safeProjectTasks} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tasks: By Labels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Label name</th>
                  <th className="text-left py-2 px-4">Overdue / Open</th>
                  <th className="text-left py-2 px-4">Completed</th>
                  <th className="text-left py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-400 rounded-sm mr-2"></div>
                      <span>High</span>
                    </div>
                  </td>
                  <td className="py-2 px-4">0/1</td>
                  <td className="py-2 px-4">0</td>
                  <td className="py-2 px-4">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPanel;
