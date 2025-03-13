
import React, { useState } from 'react';
import { UserCircle, Send, Paperclip, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const CommentItem = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    // In a real app, this would send the reply to an API
    toast({
      title: "Reply added",
      description: "Your reply has been added to the comment",
    });
    
    setReplyText('');
    setIsReplying(false);
  };

  return (
    <div className="border-l-2 border-gray-200 pl-4 mb-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user.avatar} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{comment.user.name}</h4>
            <span className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(comment.timestamp)}
            </span>
          </div>
          <p className="text-sm mt-1">{comment.text}</p>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto py-0 px-2 text-xs"
              onClick={() => setIsReplying(!isReplying)}
            >
              Reply
            </Button>
            {comment.isResolved === false && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto py-0 px-2 text-xs"
                onClick={() => toast({
                  title: "Comment resolved",
                  description: "The comment has been marked as resolved",
                })}
              >
                Resolve
              </Button>
            )}
          </div>
          
          {isReplying && (
            <form onSubmit={handleSubmitReply} className="mt-2 flex gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply to comment..."
                className="text-sm h-8"
              />
              <Button type="submit" size="sm" className="h-8">Reply</Button>
            </form>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={reply.user.avatar} />
                    <AvatarFallback>{reply.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-xs">{reply.user.name}</h5>
                      <span className="text-xs text-muted-foreground">{formatTime(reply.timestamp)}</span>
                    </div>
                    <p className="text-xs mt-1">{reply.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskComments = ({ taskId }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: '1',
      user: {
        name: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      text: 'I think we should update the design to match the brand guidelines',
      timestamp: new Date('2024-06-10T14:32:00'),
      isResolved: false,
      replies: [
        {
          user: {
            name: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/150?img=2',
          },
          text: 'I agree, I\'ll update the mockups',
          timestamp: new Date('2024-06-10T15:05:00'),
        }
      ]
    },
    {
      id: '2',
      user: {
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
      text: 'The API endpoint for this feature is ready to use',
      timestamp: new Date('2024-06-10T16:45:00'),
      isResolved: true,
      replies: []
    }
  ]);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: Date.now().toString(),
      user: {
        name: 'You',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
      text: newComment,
      timestamp: new Date(),
      isResolved: false,
      replies: []
    };
    
    setComments([newCommentObj, ...comments]);
    setNewComment('');
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the task",
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Comments & Discussion</h3>
        
        <form onSubmit={handleSubmitComment} className="flex gap-3 mb-6">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?img=4" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button type="submit" size="sm">
              <Send className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
        </form>
        
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <UserCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No comments yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskComments;
