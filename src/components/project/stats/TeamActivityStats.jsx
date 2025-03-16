
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamActivityStats = ({ members }) => {
  // Simulate activity data for each member
  const teamData = members.map((member, index) => {
    return {
      name: member.name || `Member ${index + 1}`,
      commits: Math.floor(Math.random() * 20) + 1,
      tasks: Math.floor(Math.random() * 15) + 1,
      avatar: member.avatar || ''
    };
  });
  
  // If no members, create sample data
  const sampleData = [
    { name: 'John', commits: 12, tasks: 8, avatar: '' },
    { name: 'Sarah', commits: 8, tasks: 10, avatar: '' },
    { name: 'Mike', commits: 15, tasks: 5, avatar: '' }
  ];
  
  const dataToUse = teamData.length > 0 ? teamData : sampleData;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataToUse}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ background: '#fff', border: '1px solid #eee', borderRadius: '4px' }}
              />
              <Bar dataKey="commits" fill="#8884d8" name="Commits" />
              <Bar dataKey="tasks" fill="#82ca9d" name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Top Contributors</h4>
          <div className="space-y-3">
            {dataToUse.slice(0, 3).map((member, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm">{member.commits} commits</span>
                  <span className="text-sm">{member.tasks} tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamActivityStats;
