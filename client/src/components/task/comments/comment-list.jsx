"use client";

import { useEffect } from "react";

import CommentItem from "@/components/task/comments/comment-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTaskComment } from "@/hooks/use-task-comment";

export default function CommentBox({ task }) {
  const { comments, fetchComments } = useTaskComment();

  useEffect(() => {
    fetchComments(task.id);
  }, [task.id, fetchComments]);

  return (
    <>
      {comments.length > 0 ? (
        <ScrollArea className="h-full overflow-y-auto">
          <div className="space-y-6 px-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
          <p className="text-sm">No comments yet</p>
        </div>
      )}
    </>
  );
}
