"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

import {
  createTaskComment,
  getTaskComments,
  updateTaskComment,
  deleteTaskComment
} from "@/actions/task-comment-actions";

const TaskCommentContext = createContext();

export function useTaskComment() {
  return useContext(TaskCommentContext);
}

export function TaskCommentProvider({ children }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async (taskId) => {
    try {
      setLoading(true);
      const taskCommentData = await getTaskComments(taskId);
      setComments(taskCommentData.comments);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateComment = useCallback(async (data) => {
    try {
      const newCommentData = await createTaskComment(data);
      setComments((prev) => [...prev, newCommentData.comment]);
    } catch (error) {
      setError(error);
    }
  }, []);

  const handleUpdateComment = useCallback(async (commentId, data) => {
    try {
      await updateTaskComment(commentId, data);

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, ...data, updated_at: new Date().toISOString() }
            : comment
        )
      );
    } catch (error) {
      setError(error);
    }
  }, []);

  const handleDeleteComment = useCallback(async (commentId) => {
    try {
      await deleteTaskComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setError(error);
    }
  }, []);

  const contextValue = {
    comments,
    loading,
    error,
    fetchComments,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment
  };

  return <TaskCommentContext.Provider value={contextValue}>{children}</TaskCommentContext.Provider>;
}
