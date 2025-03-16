
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  // Load notifications from localStorage
  useEffect(() => {
    if (user) {
      try {
        // Load saved notifications
        const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
        if (savedNotifications) {
          const parsedNotifications = JSON.parse(savedNotifications);
          setNotifications(parsedNotifications);
          
          // Calculate unread count
          const unread = parsedNotifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        }

        // Load saved activities
        const savedActivities = localStorage.getItem(`activities_${user.id}`);
        if (savedActivities) {
          setRecentActivities(JSON.parse(savedActivities));
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        
        // Fallback to mock data if loading fails
        const mockNotifications = [
          {
            id: '1',
            type: 'invitation',
            message: 'John invited you to join Project Alpha',
            read: false,
            createdAt: new Date().toISOString(),
            sender: {
              id: 'user123',
              name: 'John Doe',
              avatar: ''
            },
            relatedProject: 'project123'
          },
          {
            id: '2',
            type: 'message',
            message: 'New message in Project Beta chat',
            read: true,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            sender: {
              id: 'user456',
              name: 'Jane Smith',
              avatar: ''
            },
            relatedProject: 'project456'
          }
        ];
        
        setNotifications(mockNotifications);
        const unread = mockNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      }
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
    }
  }, [user, notifications]);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (user && recentActivities.length > 0) {
      localStorage.setItem(`activities_${user.id}`, JSON.stringify(recentActivities));
    }
  }, [user, recentActivities]);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    toast({
      title: newNotification.type.charAt(0).toUpperCase() + newNotification.type.slice(1),
      description: newNotification.message,
    });

    // Add to recent activities if it's a team or project related notification
    if (['invitation', 'team-add', 'project-update'].includes(newNotification.type)) {
      addActivity({
        type: newNotification.type,
        message: newNotification.message,
        timestamp: newNotification.createdAt,
        relatedProject: newNotification.relatedProject
      });
    }
    
    // Save to localStorage
    if (user) {
      const updatedNotifications = [newNotification, ...notifications];
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
    }
  };

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...activity
    };
    
    setRecentActivities(prev => [newActivity, ...prev].slice(0, 20)); // Keep only the 20 most recent activities
    
    // Save to localStorage
    if (user) {
      const updatedActivities = [newActivity, ...recentActivities].slice(0, 20);
      localStorage.setItem(`activities_${user.id}`, JSON.stringify(updatedActivities));
    }
  };

  const respondToInvitation = (notificationId, accept) => {
    // Find the notification
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification && notification.type === 'invitation') {
      // Mark as read
      markAsRead(notificationId);
      
      // In a real app, you would make an API call here
      // For now, we'll just show a toast and add an activity
      if (accept) {
        toast({
          title: "Invitation Accepted",
          description: `You've joined ${notification.sender.name}'s project`,
        });
        
        addActivity({
          type: 'project-join',
          message: `You joined ${notification.sender.name}'s project`,
          relatedProject: notification.relatedProject
        });
      } else {
        toast({
          title: "Invitation Declined",
          description: `You've declined ${notification.sender.name}'s invitation`,
        });
      }
      
      // Remove the notification from the list
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  // Add team member notification
  const notifyTeamAdd = (memberEmail, projectName) => {
    // In a real app, you would send this to the backend to notify the user
    // For now, we'll simulate it with localStorage
    
    // Create the notification
    const teamAddNotification = {
      type: 'team-add',
      message: `You've been added to the project "${projectName}"`,
      sender: {
        id: user ? user.id : 'system',
        name: user ? user.name : 'System',
        avatar: user ? user.avatar : ''
      },
      relatedProject: projectName
    };
    
    // Add it to our local notifications
    addNotification(teamAddNotification);
    
    // Store it in localStorage with a special key for demo purposes
    // In a real app, this would be handled by the backend
    localStorage.setItem(`pending_notification_${memberEmail}`, JSON.stringify(teamAddNotification));
    
    toast({
      title: "Team Invitation Sent",
      description: `Invitation sent to ${memberEmail}`
    });
    
    return true;
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount,
      recentActivities,
      markAsRead,
      markAllAsRead,
      addNotification,
      addActivity,
      respondToInvitation,
      notifyTeamAdd
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
