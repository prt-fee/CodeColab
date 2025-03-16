
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ProfileSidebar = ({ user }) => {
  const { logout } = useAuth();
  
  return (
    <Card className="md:col-span-1">
      <CardContent className="p-6 flex flex-col items-center">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold mb-1">{user.name}</h2>
        <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
        <Button variant="outline" className="w-full" onClick={logout}>
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
