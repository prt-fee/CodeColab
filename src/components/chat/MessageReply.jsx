
import React from 'react';

const MessageReply = ({ replyTo, getUserName }) => {
  if (!replyTo) return null;
  
  return (
    <div className="mt-2 border-l-2 border-primary/50 pl-2 text-xs text-muted-foreground">
      <p>Replying to {getUserName(replyTo.sender)}</p>
      <p className="truncate max-w-xs">{replyTo.text}</p>
    </div>
  );
};

export default MessageReply;
