
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AccessControl = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
        <CardDescription>Manage permissions for collaborators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Default Role for New Collaborators</h4>
            <select className="w-full p-2 border rounded-md bg-background">
              <option value="viewer">Viewer (read-only)</option>
              <option value="editor" defaultValue>Editor (can edit files)</option>
              <option value="admin">Admin (full control)</option>
            </select>
          </div>
          
          <div className="pt-2">
            <h4 className="font-medium mb-2">Branch Protection</h4>
            <div className="flex items-center">
              <input type="checkbox" id="protect-main" className="mr-2" />
              <label htmlFor="protect-main">Protect main branch</label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Require code reviews before merging to main branch
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessControl;
