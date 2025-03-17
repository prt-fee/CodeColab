
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CollaborationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collaboration Settings</CardTitle>
        <CardDescription>Configure how team members can collaborate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">File Locking</h4>
              <p className="text-sm text-muted-foreground">Prevent conflicts by locking files while editing</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Real-time Collaboration</h4>
              <p className="text-sm text-muted-foreground">See others' changes in real-time</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium">Approval Workflow</h4>
              <p className="text-sm text-muted-foreground">Require approvals before merging changes</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationSettings;
