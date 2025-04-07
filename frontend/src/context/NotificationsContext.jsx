
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock fetch notifications - in a real app, you'd fetch from an API
  useEffect(() => {
    if (user) {
      // Simulating getting notifications from server
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
      
      // Calculate unread count
      const unread = mockNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    }
  }, [user]);

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
  };

  const respondToInvitation = (notificationId, accept) => {
    // Find the notification
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification && notification.type === 'invitation') {
      // Mark as read
      markAsRead(notificationId);
      
      // In a real app, you would make an API call here
      // For now, we'll just show a toast
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
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }
  };

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      respondToInvitation
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
