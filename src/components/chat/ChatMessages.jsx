
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';

const ChatMessages = ({ messages, currentUser, getUserName }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="space-y-4">
      {messages.map(message => {
        const isCurrentUser = message.sender === 'currentUser';
        return (
          <div 
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex items-start gap-2 max-w-[80%]">
              {!isCurrentUser && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={message.senderAvatar} />
                  <AvatarFallback>
                    {getUserName(message.sender)[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div>
                {!isCurrentUser && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {getUserName(message.sender)}
                  </p>
                )}
                
                <div className={`p-3 rounded-lg ${
                  isCurrentUser 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  <p>{message.text}</p>
                </div>
                
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
