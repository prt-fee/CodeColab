
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Users } from 'lucide-react';

const ChatConversationList = ({ 
  conversations, 
  activeConversation, 
  onConversationSelect,
  getUserInfo
}) => {
  return (
    <div className="space-y-1">
      {conversations.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          No conversations yet
        </div>
      ) : (
        conversations.map(conversation => {
          const { name, avatar } = getUserInfo(conversation);
          return (
            <div 
              key={conversation.id}
              className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-accent/50 ${
                activeConversation === conversation.id ? 'bg-accent' : ''
              }`}
              onClick={() => onConversationSelect(conversation.id)}
            >
              <Avatar className="h-10 w-10">
                {conversation.type === 'group' ? (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={avatar} />
                    <AvatarFallback>{name ? name[0] : 'U'}</AvatarFallback>
                  </>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{name}</p>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                    </span>
                  )}
                </div>
                
                {conversation.lastMessage && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.lastMessage.sender === 'currentUser' 
                      ? 'You: ' 
                      : `${name}: `}
                    {conversation.lastMessage.text}
                  </p>
                )}
              </div>
              
              {conversation.unread > 0 && (
                <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                  {conversation.unread}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatConversationList;
