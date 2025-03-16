
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PasswordChangeForm = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation must match",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully"
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handlePasswordChange}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="font-medium text-sm">
            Current Password
          </label>
          <Input
            id="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            placeholder="Enter current password"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="newPassword" className="font-medium text-sm">
            New Password
          </label>
          <Input
            id="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            placeholder="Enter new password"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="font-medium text-sm">
            Confirm New Password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
            required
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Change Password'
          )}
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
