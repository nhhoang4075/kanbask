"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

import {
  getTasksOfProject,
  getMyAssignedTasks,
  createTask,
  updateTask,
  deleteTask
} from "@/actions/task-actions";
import { useProject } from "@/hooks/use-project";

const TaskContext = createContext();

export function useTask() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const { selectedProject, projectMembers } = useProject();

  const [tasks, setTasks] = useState([]);
  const [myAssignedTasks, setMyAssignedTasks] = useState([]);

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

  const fetchMyAssignedTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyAssignedTasks();
      setMyAssignedTasks(data.tasks);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Initial fetch
  useEffect(() => {
    fetchMyAssignedTasks();
  }, [tasks, fetchMyAssignedTasks]);

  // Create a new task
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      const newTaskData = await createTask(taskData);

      setTasks((prev) => [...prev, newTaskData.task]);
    } catch (err) {
      setError(err);
    }
  }, []);

  // Update a task
  const handleUpdateTask = useCallback(
    async (taskId, updates) => {
      try {
        // Get the current task to preserve existing assignees
        const currentTask = tasks.find((task) => task.id === taskId);
        const existingAssignees = currentTask?.assignees || [];
        let updatedAssignees = existingAssignees;

        // Only update assignees if updates.assignees is present
        if (updates.assignees) {
          // ...existing assignee update logic...
          let newAssignees = [];
          if (updates.assignees.length !== 0) {
            newAssignees = projectMembers
              .filter((member) => updates.assignees.includes(member.id))
              .map((member) => ({
                user_id: member.id,
                full_name: member.full_name,
                avatar_url: member.avatar_url,
                assigned_at: new Date().toISOString()
              }));

            updatedAssignees = [
              ...existingAssignees.filter((existing) =>
                updates.assignees.includes(existing.user_id)
              ),
              ...newAssignees.filter(
                (newAssignee) =>
                  !existingAssignees.some((existing) => existing.user_id === newAssignee.user_id)
              )
            ];
          }
        }

        // Optimistic update: always update the task with new fields
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

  const contextValue = {
    tasks,
    myAssignedTasks,
    loading,
    error,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleReorderTask,
    fetchMyAssignedTasks
  };

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
}
