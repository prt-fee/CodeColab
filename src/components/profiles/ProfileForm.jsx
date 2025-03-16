
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfileForm = ({ user, updateUser }) => {
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Use the updateUser function from AuthContext
    if (updateUser(profileData)) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } else {
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive"
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleProfileUpdate}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="font-medium text-sm flex items-center">
            <User className="h-4 w-4 mr-2" />
            Full Name
          </label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            placeholder="Your name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="font-medium text-sm flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            placeholder="Your email"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="avatar" className="font-medium text-sm">
            Avatar URL
          </label>
          <Input
            id="avatar"
            value={profileData.avatar}
            onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Profile'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
