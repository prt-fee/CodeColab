
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

const TeamPanel = ({ members }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          People working on this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map(member => (
            <div key={member.id} className="flex items-center p-3 border rounded-lg">
              <div className="h-10 w-10 rounded-full bg-accent overflow-hidden mr-3">
                <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-xs text-muted-foreground">Team Member</p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamPanel;
