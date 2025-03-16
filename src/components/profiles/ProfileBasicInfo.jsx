
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const ProfileBasicInfo = ({ user, logout }) => {
  return (
    <div className="p-6 flex flex-col items-center">
      <Avatar className="h-32 w-32 mb-4">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-bold mb-1">{user.name}</h2>
      <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
      <Button variant="outline" className="w-full" onClick={logout}>
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileBasicInfo;
