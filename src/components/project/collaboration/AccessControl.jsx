
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const AccessControl = () => {
  const [defaultRole, setDefaultRole] = useState("editor");
  const [protectMain, setProtectMain] = useState(false);

  const handleRoleChange = (value) => {
    setDefaultRole(value);
    toast({
      title: "Default role updated",
      description: `New collaborators will be added as ${value}s by default`
    });
  };

  const handleProtectMainChange = () => {
    const newValue = !protectMain;
    setProtectMain(newValue);
    toast({
      title: newValue ? "Branch protection enabled" : "Branch protection disabled",
      description: newValue ? "Code reviews are now required for the main branch" : "Protection removed from main branch"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
        <CardDescription>Manage permissions for collaborators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="font-medium">Default Role for New Collaborators</h4>
            <Select value={defaultRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer (read-only)</SelectItem>
                <SelectItem value="editor">Editor (can edit files)</SelectItem>
                <SelectItem value="admin">Admin (full control)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Branch Protection</h4>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="protect-main">Protect main branch</Label>
                <p className="text-sm text-muted-foreground">
                  Require code reviews before merging to main branch
                </p>
              </div>
              <Switch
                id="protect-main"
                checked={protectMain}
                onCheckedChange={handleProtectMainChange}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessControl;
