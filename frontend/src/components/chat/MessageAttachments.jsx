
import React from 'react';
import { File, Image, FileText, Film, Music, Archive } from 'lucide-react';

const getFileIcon = (fileType) => {
  if (!fileType) return <File className="h-4 w-4" />;
  
  if (fileType.includes('image')) return <Image className="h-4 w-4" />;
  if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-4 w-4" />;
  if (fileType.includes('video')) return <Film className="h-4 w-4" />;
  if (fileType.includes('audio')) return <Music className="h-4 w-4" />;
  if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="h-4 w-4" />;
  
  return <File className="h-4 w-4" />;
};

const MessageAttachments = ({ attachments }) => {
  if (!attachments || attachments.length === 0) return null;
  
  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment, index) => (
        <div 
          key={index} 
          className="border rounded-md p-2 bg-background/50 flex items-center gap-2 hover:bg-background/80 transition-colors"
        >
          {getFileIcon(attachment.type)}
          <div className="text-xs text-muted-foreground flex-grow truncate">
            {attachment.name}
            {attachment.size && <span className="ml-1">({attachment.size})</span>}
          </div>
          <a 
            href={attachment.url || '#'} 
            download={attachment.name}
            className="text-xs text-primary hover:underline"
            onClick={(e) => !attachment.url && e.preventDefault()}
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
};

export default MessageAttachments;
