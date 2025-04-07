
import React from 'react';
import { Smile, ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const ReactionPickerButton = ({ onSelectReaction }) => {
  const reactions = [
    { emoji: '👍', name: 'thumbs up' },
    { emoji: '❤️', name: 'heart' },
    { emoji: '😂', name: 'joy' },
    { emoji: '😮', name: 'wow' },
    { emoji: '😢', name: 'sad' },
    { emoji: '😡', name: 'angry' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Smile className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 flex gap-1">
        {reactions.map((reaction) => (
          <button
            key={reaction.name}
            className="text-lg p-1 hover:bg-muted rounded transition-colors"
            onClick={() => onSelectReaction(reaction.emoji)}
            title={reaction.name}
          >
            {reaction.emoji}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

const MessageActionsPanel = ({ isVisible, onReply, onReact }) => {
  if (!isVisible) return null;
  
  const handleSelectReaction = (emoji) => {
    console.log('Selected reaction:', emoji);
    onReact(emoji);
  };
  
  return (
    <div className="absolute -top-3 right-2 bg-background border rounded-full shadow-sm p-1 flex gap-1">
      <ReactionButton 
        icon={ThumbsUp} 
        tooltip="Like" 
        onClick={() => onReact('👍')}
      />
      <ReactionPickerButton onSelectReaction={handleSelectReaction} />
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

export default MessageActionsPanel;
