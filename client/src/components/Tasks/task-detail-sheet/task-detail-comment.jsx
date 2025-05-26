"use client";

import { useState, useEffect, useRef } from "react";

import { format, formatDistanceToNow } from "date-fns";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSocket } from "@/hooks/use-socket";
import { useTask } from "@/hooks/use-tasks";

export function TaskDetailsComments({ onAddComment, onClose }) {
  const { addComment, selectedTask } = useTask();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState(selectedTask.comments || []);
  const { socket, isConnected } = useSocket();
  const scrollAreaRef = useRef(null);

  // Join the task room when the component mounts
  useEffect(() => {
    if (socket && selectedTask.id) {
      // Join the task room
      socket.emit("join-task", task.id);

      // Listen for new comments
      socket.on("comment-added", (newComment) => {
        setComments((prevComments) => [...prevComments, newComment]);

        // Scroll to bottom when new comment is received
        setTimeout(() => {
          if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector(
              "[data-radix-scroll-area-viewport]"
            );
            if (scrollContainer) {
              scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
          }
        }, 100);
      });

      // Clean up when the component unmounts
      return () => {
        socket.emit("leave-task", selectedTask.id);
        socket.off("comment-added");
      };
    }
  }, [socket, selectedTask.id]);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      // Create a new comment object
      const comment = {
        id: `comment-${Date.now()}`,
        text: newComment.trim(),
        author: {
          id: "user-1", // Assuming current user is John Doe
          name: "John Doe",
          avatar: "/placeholder.svg?height=40&width=40"
        },
        createdAt: new Date().toISOString()
      };

      // Add the comment locally
      setComments((prevComments) => [...prevComments, comment]);

      // Add the comment using the context
      addComment(selectedTask.id, comment);

      // Call the onAddComment callback if provided
      if (onAddComment) {
        await onAddComment(comment);
      }

      // Emit the new comment to other clients
      if (socket) {
        socket.emit("new-comment", {
          taskId: selectedTask.id,
          comment
        });
      }

      // Clear the input
      setNewComment("");

      // Scroll to bottom
      setTimeout(() => {
        if (scrollAreaRef.current) {
          const scrollContainer = scrollAreaRef.current.querySelector(
            "[data-radix-scroll-area-viewport]"
          );
          if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }
        }
      }, 100);
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

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-250px)] pr-4">
          {sortedComments.length > 0 ? (
            <div className="space-y-6 py-4">
              {sortedComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.author.avatar || "/placeholder.svg"}
                      alt={comment.author.name}
                    />
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              {isConnected ? (
                <span className="text-green-500 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Connected
                </span>
              ) : (
                <span className="text-yellow-500 flex items-center">
                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                  Connecting...
                </span>
              )}
            </div>
          </div>
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSubmitComment();
              }
            }}
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
}
