
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

const ReactionButton = ({ icon: Icon, tooltip, onClick, className }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <button 
          onClick={onClick} 
          className={`p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors ${className}`}
        >
          <Icon className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const MessageActions = ({ isVisible, onReply, onReact }) => {
  if (!isVisible) return null;
  
  return (
    <div className="absolute -top-3 right-2 bg-background border rounded-full shadow-sm p-1 flex gap-1">
      <ReactionButton 
        icon={ThumbsUp} 
        tooltip="Like" 
        onClick={onReact}
      />
      <ReactionButton 
        icon={Smile} 
        tooltip="Add reaction" 
        onClick={onReact}
      />
      <ReactionButton 
        icon={Reply} 
        tooltip="Reply" 
        onClick={onReply}
      />
      <ReactionButton 
        icon={MoreVertical} 
        tooltip="More options" 
        onClick={() => {}}
      />
    </div>
  );
};

const ChatMessages = ({ messages, currentUser, getUserName }) => {
  const messagesEndRef = useRef(null);
  const [hoveredMessage, setHoveredMessage] = React.useState(null);

  useEffect(() => {
    // Scroll to bottom of messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleReply = (messageId) => {
    console.log('Reply to message:', messageId);
    // Implement reply functionality
  };

  const handleReact = (messageId) => {
    console.log('React to message:', messageId);
    // Implement reaction functionality
  };

  const renderMessageReactions = (reactions) => {
    if (!reactions || reactions.length === 0) return null;
    
    return (
      <div className="flex gap-1 mt-1">
        {reactions.map((reaction, index) => (
          <div key={index} className="flex items-center bg-muted px-1.5 py-0.5 rounded-full text-xs">
            <span>{reaction.emoji}</span>
            <span className="ml-1">{reaction.count}</span>
          </div>
        ))}
      </div>
    );
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
                    <MessageActions 
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
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div key={index} className="border rounded p-2 bg-background/50 flex items-center gap-2">
                              <div className="text-xs text-muted-foreground">{attachment.name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Render reply reference if it exists */}
                      {message.replyTo && (
                        <div className="mt-2 border-l-2 border-primary/50 pl-2 text-xs text-muted-foreground">
                          <p>Replying to {getUserName(message.replyTo.sender)}</p>
                          <p className="truncate">{message.replyTo.text}</p>
                        </div>
                      )}
                    </div>
                    
                    {renderMessageReactions(reactions)}
                    
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
    </div>
  );
};

export default ChatMessages;
