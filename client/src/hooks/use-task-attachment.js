"use client";

import { createContext, useContext, useState, useCallback } from "react";

import {
  uploadTaskAttachments,
  getTaskAttachments,
  deleteTaskAttachments
} from "@/actions/task-actions";

const TaskAttachmentContext = createContext();

export function useTaskAttachment() {
  return useContext(TaskAttachmentContext);
}

export function TaskAttachmentProvider({ children }) {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttachments = useCallback(
    async (taskId) => {
      try {
        setLoading(true);
        const attachmentData = await getTaskAttachments(taskId);

        setAttachments(attachmentData.attachments);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [attachments]
  );

  const handleUploadAttachments = useCallback(
    async (taskId, files) => {
      try {
        const attachmentData = await uploadTaskAttachments(taskId, files);

        setAttachments([...attachments, ...attachmentData.attachments]);
      } catch (err) {
        setError(err);
      }
    },
    [attachments]
  );

  const handleDeleteAttachments = useCallback(
    async (taskId, attachmentIds) => {
      try {
        setAttachments(attachments.filter((attachment) => !attachmentIds.includes(attachment.id)));

        await deleteTaskAttachments(taskId, attachmentIds);
      } catch (err) {
        setError(err);
      }
    },
    [attachments]
  );

  const contextValue = {
    attachments,
    loading,
    error,
    fetchAttachments,
    handleUploadAttachments,
    handleDeleteAttachments
  };

  return (
    <TaskAttachmentContext.Provider value={contextValue}>{children}</TaskAttachmentContext.Provider>
  );
}
