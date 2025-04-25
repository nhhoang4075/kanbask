"use client";

import { useEffect, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { sampleComments } from "@/data/tasks";

const TaskDetailsComments = ({ task, onAddComment, onClose }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(sampleComments);
  const [sortedComments, setSortedComments] = useState([]);

  useEffect(() => {
    setSortedComments(() => comments.filter((comment) => comment.taskId === task.id));
  }, [comments]);

  const handleSubmitComment = () => {
    // if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      // Create a new comment object
      const comment = {
        id: `comment-${Date.now()}`,
        text: newComment.trim(),
        taskId: task.id,
        author: {
          id: "user-1", // Assuming current user is John Doe
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40"
        },
        createdAt: new Date().toISOString()
      };

      // Call the onAddComment callback
      setComments((prevComments) => [...prevComments, comment]);

      // Clear the input
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCommentDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / 36e5; // Convert to hours

    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-320px)] pr-1.5">
          {sortedComments.length > 0 ? (
            <div className="space-y-6 py-4">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={""} alt={comment.author.name} />
                    <AvatarFallback>
                      {comment.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{comment.author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCommentDate(comment.createdAt)}
                      </div>
                    </div>
                    <div className="text-sm">{comment.text}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground text-sm">
                No comments yet. Be the first to comment!
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="pt-4">
        <Separator className="my-4" />
        <div className="space-y-1.5">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSubmitComment} disabled={!newComment.trim() || isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsComments;
