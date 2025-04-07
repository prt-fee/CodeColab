
import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Smile, ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import MessageActionsPanel from './MessageActionsPanel';
import MessageAttachments from './MessageAttachments';
import MessageReply from './MessageReply';
import MessageReactions from './MessageReactions';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ChatMessages = ({ messages, currentUser, getUserName }) => {
  const messagesEndRef = useRef(null);
  const [hoveredMessage, setHoveredMessage] = React.useState(null);
  const [replyingTo, setReplyingTo] = React.useState(null);

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleReply = (messageId) => {
    console.log('Reply to message:', messageId);
    const message = messages.find(m => m.id === messageId);
    if (message) {
      setReplyingTo(message);
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleReact = (messageId) => {
    console.log('React to message:', messageId);
    // Implement reaction functionality
  };

  return (
    <div className="space-y-6">
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map(message => {
          const isCurrentUser = message.sender === currentUser;
          const isHovered = hoveredMessage === message.id;
          
          // Extract reactions from message if they exist
          const reactions = message.reactions || [];
          
          return (
            <div 
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              onMouseEnter={() => setHoveredMessage(message.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div className="flex items-start gap-2 max-w-[80%] relative">
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
                  
                  <div className="relative">
                    <MessageActionsPanel 
                      isVisible={isHovered}
                      onReply={() => handleReply(message.id)}
                      onReact={() => handleReact(message.id)}
                    />
                    
                    <div className={`p-3 rounded-lg ${
                      isCurrentUser 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <p>{message.text}</p>
                      
                      {/* Render attachments if they exist */}
                      {message.attachments && message.attachments.length > 0 && (
                        <MessageAttachments attachments={message.attachments} />
                      )}
                      
                      {/* Render reply reference if it exists */}
                      {message.replyTo && (
                        <MessageReply 
                          replyTo={message.replyTo} 
                          getUserName={getUserName} 
                        />
                      )}
                    </div>
                    
                    <MessageReactions reactions={reactions} />
                    
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
      
      {replyingTo && (
        <div className="fixed bottom-16 left-0 right-0 bg-background border-t p-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-1 h-10 bg-blue-500 mr-2"></div>
            <div>
              <p className="text-xs text-muted-foreground">
                Replying to {getUserName(replyingTo.sender)}
              </p>
              <p className="text-sm truncate">{replyingTo.text}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleCancelReply}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
