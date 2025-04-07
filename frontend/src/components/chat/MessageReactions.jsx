
import React from 'react';

const MessageReactions = ({ reactions }) => {
  if (!reactions || reactions.length === 0) return null;
  
  // Group identical reactions
  const groupedReactions = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = acc[reaction.emoji] || { emoji: reaction.emoji, count: 0, users: [] };
    acc[reaction.emoji].count += 1;
    acc[reaction.emoji].users.push(reaction.user);
    return acc;
  }, {});
  
  return (
    <div className="flex gap-1 mt-1">
      {Object.values(groupedReactions).map((reaction, index) => (
        <div 
          key={index} 
          className="flex items-center bg-muted px-1.5 py-0.5 rounded-full text-xs hover:bg-muted/80 cursor-pointer"
          title={`${reaction.users.join(', ')}`}
        >
          <span>{reaction.emoji}</span>
          <span className="ml-1">{reaction.count}</span>
        </div>
      ))}
    </div>
  );
};

export default MessageReactions;
