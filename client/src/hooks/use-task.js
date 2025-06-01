"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

import {
  getTasksOfProject,
  createTask,
  updateTask,
  deleteTask,
  uploadTaskAttachments,
  getTaskAttachmentUrl,
  deleteTaskAttachments
} from "@/actions/task-actions";
import { useProject } from "@/hooks/use-project";

const TaskContext = createContext();

export function useTask() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const { selectedProject, projectMembers } = useProject();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!selectedProject) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getTasksOfProject(selectedProject.id);
      setTasks(data.tasks);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create a new task
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      const newTaskData = await createTask(taskData);

      setTasks((prev) => [newTaskData.task, ...prev]);
    } catch (err) {
      setError(err);
    }
  }, []);

  // Update a task
  const handleUpdateTask = useCallback(
    async (taskId, updates) => {
      try {
        /**
         * Optimistic update
         * 1. Get the current task to preserve existing assignees
         * 2. Get new assignees from project members
         * 3. Filter out removed assignees and merge with new ones
         * 4. Update the task with the new assignees
         * 5. Call the updateTask action to update the task in the database
         */
        // Get the current task to preserve existing assignees
        const currentTask = tasks.find((task) => task.id === taskId);
        const existingAssignees = currentTask?.assignees || [];

        // Get new assignees from project members
        const newAssignees = projectMembers
          .filter((member) => updates.assignees.includes(member.id))
          .map((member) => ({
            user_id: member.id,
            full_name: member.full_name,
            avatar_url: member.avatar_url,
            assigned_at: new Date().toISOString()
          }));

        // Filter out removed assignees and merge with new ones
        const updatedAssignees = [
          ...existingAssignees.filter((existing) => updates.assignees.includes(existing.user_id)),
          ...newAssignees.filter(
            (newAssignee) =>
              !existingAssignees.some((existing) => existing.user_id === newAssignee.user_id)
          )
        ];

        // Optimistic update
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...updates,
                  assignees: updatedAssignees,
                  updated_at: new Date().toISOString()
                }
              : task
          )
        );

        await updateTask(taskId, updates);
      } catch (err) {
        setError(err);
      }
    },
    [tasks, projectMembers]
  );

  // Delete a task
  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));

      await deleteTask(taskId);
    } catch (err) {
      setError(err);
    }
  }, []);

  // Reorder tasks (for drag and drop in list view)
  const handleReorderTask = useCallback(async (taskId, newPosition) => {
    try {
      await updateTask(taskId, { position: newPosition });
    } catch (err) {
      setError(err);
    }
  }, []);

  const handleUploadTaskAttachments = useCallback(async (taskId, files) => {
    try {
      await uploadTaskAttachments(taskId, files);
    } catch (err) {
      setError(err);
    }
  }, []);

  const handleGetTaskAttachmentUrl = useCallback(async (taskId, attachmentId) => {
    try {
      await getTaskAttachmentUrl(taskId, attachmentId);
    } catch (err) {
      setError(err);
    }
  }, []);

  const handleDeleteTaskAttachments = useCallback(async (taskId, attachmentIds) => {
    try {
      await deleteTaskAttachments(taskId, attachmentIds);
    } catch (err) {
      setError(err);
    }
  }, []);

  const contextValue = {
    tasks,
    loading,
    error,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleReorderTask,
    handleUploadTaskAttachments,
    handleGetTaskAttachmentUrl,
    handleDeleteTaskAttachments
  };

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
}
