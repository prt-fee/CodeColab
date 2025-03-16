
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const TaskCompletionStats = ({ tasks }) => {
  // Count tasks by status
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completedTasks / total) * 100) : 0;
  
  // Data for pie chart
  const chartData = [
    { name: 'Completed', value: completedTasks || 1, color: '#22c55e' },
    { name: 'In Progress', value: inProgressTasks || 1, color: '#3b82f6' },
    { name: 'To Do', value: todoTasks || 1, color: '#64748b' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} tasks`, name]}
                contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <p className="text-2xl font-bold">{completedTasks}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">In Progress</span>
            </div>
            <p className="text-2xl font-bold">{inProgressTasks}</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <Circle className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium">To Do</span>
            </div>
            <p className="text-2xl font-bold">{todoTasks}</p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">Overall Completion</p>
          <p className="text-3xl font-bold">{completionRate}%</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCompletionStats;
