
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, UserPlus } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const TeamMembersSheet = ({
  isOpen,
  onOpenChange,
  searchTerm,
  onSearchChange,
  searchResults,
  onAddUser,
  membersArray
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Project Team</SheetTitle>
          <SheetDescription>
            View team members and add new collaborators
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6">
          <div className="relative mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="mb-6 space-y-1 border rounded-md p-1">
              <h3 className="px-2 pt-2 text-sm font-medium">Search Results</h3>
              {searchResults.map(user => (
                <div 
                  key={user.id}
                  className="p-2 hover:bg-accent rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => onAddUser(user)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium mb-3">Team Members</h3>
            <div className="space-y-2">
              {membersArray.length > 0 ? (
                membersArray.map((member, index) => (
                  <div 
                    key={member.id || index}
                    className="p-2 bg-muted rounded-md flex items-center gap-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>
                        {member.name ? member.name.charAt(0) : `U${index}`}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email || 'No email'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No team members yet</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TeamMembersSheet;
