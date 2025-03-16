
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';

const CommitActivityStats = ({ commits }) => {
  // Prepare the data for the past 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, 'MM/dd'),
      count: 0,
      formattedDate: format(date, 'MMM dd, yyyy')
    };
  });
  
  // If we have real commits, count them by day
  if (commits && commits.length > 0) {
    commits.forEach(commit => {
      try {
        const commitDate = typeof commit.date === 'string' 
          ? parseISO(commit.date) 
          : new Date(commit.date);
          
        const dateString = format(commitDate, 'MM/dd');
        const dayData = last7Days.find(day => day.date === dateString);
        
        if (dayData) {
          dayData.count += 1;
        }
      } catch (e) {
        console.error('Error parsing commit date:', e);
      }
    });
  } else {
    // Sample data if no commits
    last7Days[1].count = 2;
    last7Days[2].count = 5;
    last7Days[4].count = 3;
    last7Days[6].count = 1;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commit Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={last7Days}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => {
                  const day = last7Days.find(day => day.date === label);
                  return day ? day.formattedDate : label;
                }}
                formatter={(value) => [`${value} commits`, 'Commits']}
                contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8884d8" 
                name="Commits" 
                strokeWidth={2} 
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium">Total Commits</h4>
              <p className="text-2xl font-bold">
                {last7Days.reduce((sum, day) => sum + day.count, 0)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Avg. Per Day</h4>
              <p className="text-2xl font-bold">
                {(last7Days.reduce((sum, day) => sum + day.count, 0) / 7).toFixed(1)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Most Active Day</h4>
              <p className="text-lg font-bold">
                {last7Days.reduce((max, day) => day.count > max.count ? day : max, { count: 0 }).date}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitActivityStats;
