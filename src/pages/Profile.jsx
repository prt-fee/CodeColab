
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, UserCircle, Moon, Sun, Save, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      updateUser(userProfile);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
      setIsLoading(false);
    }, 800);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement actual theme toggling
    toast({
      title: `${!isDarkMode ? 'Dark' : 'Light'} mode activated`,
      description: "Your theme preference has been saved"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {userProfile.avatar ? (
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      className="h-24 w-24 rounded-full object-cover border-4 border-background"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-primary" />
                    </div>
                  )}
                </div>
                <CardTitle>{userProfile.name || 'Your Name'}</CardTitle>
                <CardDescription>{userProfile.email || 'your.email@example.com'}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground text-sm">
                  {userProfile.bio || 'No bio yet. Add a bio in your profile settings.'}
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                        placeholder="Your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={userProfile.avatar}
                        onChange={(e) => setUserProfile({...userProfile, avatar: e.target.value})}
                        placeholder="https://example.com/your-avatar.jpg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={userProfile.bio}
                        onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize how the app looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Switch between dark and light themes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className={`h-4 w-4 ${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                        <Switch
                          id="dark-mode"
                          checked={isDarkMode}
                          onCheckedChange={toggleTheme}
                        />
                        <Moon className={`h-4 w-4 ${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                    <Separator />
                    {/* Additional appearance settings could go here */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Choose what notifications you want to receive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="task-reminders">Task Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notifications about upcoming tasks
                        </p>
                      </div>
                      <Switch id="task-reminders" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="project-updates">Project Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your projects
                        </p>
                      </div>
                      <Switch id="project-updates" defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="team-messages">Team Messages</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when team members send messages
                        </p>
                      </div>
                      <Switch id="team-messages" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
