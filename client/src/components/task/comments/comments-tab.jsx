"use client";

import { TaskCommentProvider } from "@/hooks/use-task-comment";
import CommentList from "@/components/task/comments/comment-list";
import CommentInput from "@/components/task/comments/comment-input";

export default function CommentsTab({ task }) {
  return (
    <TaskCommentProvider>
      <div className="flex flex-col h-[calc(100vh-124px)]">
        <CommentList task={task} />
        <CommentInput task={task} />
      </div>
    </TaskCommentProvider>
  );
}
