
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const storedNotifications = localStorage.getItem('user_notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
        
        // Calculate unread count
        const unread = parsedNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error parsing notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('user_notifications', JSON.stringify(notifications));
  }, [notifications]);

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
      title: notification.type.charAt(0).toUpperCase() + notification.type.slice(1),
      description: notification.message,
    });
  };

  const removeNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const respondToInvitation = (notificationId, accept) => {
    // Find the notification
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification && notification.type === 'invitation') {
      // Mark as read
      markAsRead(notificationId);
      
      // In a real app, you would make an API call here
      if (accept) {
        toast({
          title: "Invitation Accepted",
          description: `You've joined ${notification.sender.name}'s project`,
        });
      } else {
        toast({
          title: "Invitation Declined",
          description: `You've declined ${notification.sender.name}'s invitation`,
        });
      }
      
      // Remove the notification from the list
      removeNotification(notificationId);
    }
  };

  // Add this function to track team member additions
  const notifyTeamMemberAdded = (memberName, memberEmail, projectTitle) => {
    addNotification({
      type: 'team',
      message: `${memberName} (${memberEmail}) has been added to project: ${projectTitle}`,
      sender: {
        id: 'system',
        name: 'System',
        avatar: ''
      }
    });
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      removeNotification,
      respondToInvitation,
      notifyTeamMemberAdded
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsProvider;
