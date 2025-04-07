
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileEdit, GitBranch, UserPlus, UploadCloud, History } from 'lucide-react';

const ActivityStream = ({ activities = [] }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Stream</CardTitle>
        <CardDescription>Recent collaboration activity on this project</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {activity.type === 'edit' ? (
                      <FileEdit className="h-5 w-5 text-blue-500" />
                    ) : activity.type === 'commit' ? (
                      <GitBranch className="h-5 w-5 text-green-500" />
                    ) : activity.type === 'invitation' ? (
                      <UserPlus className="h-5 w-5 text-purple-500" />
                    ) : activity.type === 'upload' ? (
                      <UploadCloud className="h-5 w-5 text-cyan-500" />
                    ) : (
                      <History className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No activity yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityStream;
