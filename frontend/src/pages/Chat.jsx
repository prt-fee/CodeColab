
import React, { useState, useEffect, useRef } from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Send, Search, Plus, Users, MessageCircle } from 'lucide-react';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatConversationList from '@/components/chat/ChatConversationList';

// Mock data for development
const MOCK_USERS = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com', avatar: '' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
  { id: 'u3', name: 'Mike Johnson', email: 'mike@example.com', avatar: '' },
];

const MOCK_CONVERSATIONS = [
  { 
    id: 'c1', 
    name: 'Project Alpha Team', 
    type: 'group',
    participants: ['u1', 'u2', 'u3'],
    lastMessage: {
      sender: 'u1',
      text: 'Let\'s discuss the new design',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    unread: 2
  },
  { 
    id: 'c2', 
    name: null,
    type: 'direct',
    participants: ['u1'],
    lastMessage: {
      sender: 'u1',
      text: 'Can you send me the latest files?',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    unread: 0
  },
];

// Mock messages for development
const MOCK_MESSAGES = {
  'c1': [
    { id: 'm1', sender: 'u1', text: 'Hello team!', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
    { id: 'm2', sender: 'u2', text: 'Hi John! How are you?', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString() },
    { id: 'm3', sender: 'u3', text: 'Good morning everyone!', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'm4', sender: 'u1', text: 'Let\'s discuss the new design', timestamp: new Date(Date.now() - 1800000).toISOString() },
  ],
  'c2': [
    { id: 'm5', sender: 'u1', text: 'Hi there!', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
    { id: 'm6', sender: 'currentUser', text: 'Hello John, how can I help?', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString() },
    { id: 'm7', sender: 'u1', text: 'Can you send me the latest files?', timestamp: new Date(Date.now() - 86400000).toISOString() },
  ]
};

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim()) {
      const filtered = MOCK_USERS.filter(
        user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm]);

  const handleConversationSelect = (conversationId) => {
    setActiveConversation(conversationId);
    // Load messages for this conversation
    setMessages(MOCK_MESSAGES[conversationId] || []);
    
    // Mark conversation as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unread: 0 } 
          : conv
      )
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'currentUser',
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    // Add message to UI
    setMessages(prev => [...prev, newMsg]);
    
    // Update last message in conversation list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation 
          ? { 
              ...conv, 
              lastMessage: {
                sender: 'currentUser',
                text: newMessage,
                timestamp: new Date().toISOString()
              }
            } 
          : conv
      )
    );
    
    // Clear input
    setNewMessage('');
  };

  const handleStartConversation = (userId) => {
    // In a real app, you'd check if a conversation already exists
    // For this demo, we'll just create a new one
    const selectedUser = MOCK_USERS.find(u => u.id === userId);
    
    if (selectedUser) {
      const newConversation = {
        id: `c${Date.now()}`,
        name: null,
        type: 'direct',
        participants: [userId],
        lastMessage: null,
        unread: 0
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation.id);
      setMessages([]);
      setSearchTerm('');
      setFilteredUsers([]);
    }
  };

  const getUserName = (userId) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getParticipantInfo = (conversation) => {
    if (conversation.type === 'group') {
      return {
        name: conversation.name,
        avatar: null
      };
    } else {
      // Direct message - get the other user's info
      const otherUserId = conversation.participants[0];
      const otherUser = MOCK_USERS.find(u => u.id === otherUserId);
      
      return {
        name: otherUser ? otherUser.name : 'Unknown User',
        avatar: otherUser ? otherUser.avatar : null
      };
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <NavBar />
      <div className="container mx-auto py-6 px-4 md:px-6 pt-20">
        <h1 className="text-3xl font-bold mb-6">Team Chat</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Sidebar with conversations */}
          <div className="md:col-span-4 lg:col-span-3">
            <Card className="h-[calc(100vh-180px)]">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle>Conversations</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Search results */}
                {filteredUsers.length > 0 && (
                  <div className="mt-2 border rounded-md overflow-hidden">
                    {filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        className="p-2 hover:bg-accent flex items-center gap-2 cursor-pointer"
                        onClick={() => handleStartConversation(user.id)}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="p-0 overflow-auto h-full">
                <ChatConversationList 
                  conversations={conversations}
                  activeConversation={activeConversation}
                  onConversationSelect={handleConversationSelect}
                  getUserInfo={getParticipantInfo}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Chat area */}
          <div className="md:col-span-8 lg:col-span-9">
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              {activeConversation ? (
                <>
                  <CardHeader className="p-4 border-b">
                    {(() => {
                      const conversation = conversations.find(c => c.id === activeConversation);
                      if (!conversation) return null;
                      
                      const { name, avatar } = getParticipantInfo(conversation);
                      
                      return (
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            {conversation.type === 'group' ? (
                              <div className="h-full w-full flex items-center justify-center bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                              </div>
                            ) : (
                              <>
                                <AvatarImage src={avatar} />
                                <AvatarFallback>{name[0]}</AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{name}</CardTitle>
                            <CardDescription>
                              {conversation.type === 'group' 
                                ? `${conversation.participants.length} members` 
                                : 'Direct message'}
                            </CardDescription>
                          </div>
                        </div>
                      );
                    })()}
                  </CardHeader>
                  
                  <CardContent className="p-4 flex-1 overflow-auto">
                    <ChatMessages 
                      messages={messages} 
                      currentUser="currentUser"
                      getUserName={getUserName} 
                    />
                  </CardContent>
                  
                  <CardFooter className="p-4 border-t">
                    <div className="flex w-full gap-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Select a conversation from the sidebar or search for a user to start a new conversation.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
