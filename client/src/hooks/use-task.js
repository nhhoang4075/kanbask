"use client";

import { createContext, useContext, useEffect, useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getTasksOfProject,
  getMyAssignedTasks,
  createTask,
  updateTask,
  deleteTask
} from "@/actions/task-actions";
import { useProject } from "@/hooks/use-project";
import { useSocket } from "@/hooks/use-socket";

const TaskContext = createContext();

export function useTask() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const { selectedProject, projectMembers } = useProject();
  const { socket, connected } = useSocket();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", selectedProject?.id],
    queryFn: async () => {
      const data = await getTasksOfProject(selectedProject.id);
      return data.tasks;
    },
    enabled: !!selectedProject?.id
  });
  const tasks = tasksQuery.data ?? [];

  const myAssignedTasksQuery = useQuery({
    queryKey: ["my-assigned-tasks"],
    queryFn: async () => {
      const data = await getMyAssignedTasks();
      return data.tasks;
    }
  });
  const myAssignedTasks = myAssignedTasksQuery.data ?? [];

  const [mutationError, setMutationError] = useState(null);

  const loading = tasksQuery.isLoading || myAssignedTasksQuery.isLoading;
  const error = tasksQuery.error || myAssignedTasksQuery.error || mutationError;

  const fetchMyAssignedTasks = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["my-assigned-tasks"] }),
    [queryClient]
  );

  // Real-time sync: another member created/updated/deleted/reordered a task
  useEffect(() => {
    if (!socket || !connected) return;

    const handleTaskChanged = (payload) => {
      if (payload?.project_id) {
        queryClient.invalidateQueries({ queryKey: ["tasks", payload.project_id] });
      }
      queryClient.invalidateQueries({ queryKey: ["my-assigned-tasks"] });
    };

    socket.on("task_changed", handleTaskChanged);

    return () => {
      socket.off("task_changed", handleTaskChanged);
    };
  }, [socket, connected, queryClient]);

  const handleConflict = useCallback(
    async (err) => {
      if (err?.status === 409) {
        toast.error(err.message || "This task was updated by someone else. Refreshing...");
        await queryClient.invalidateQueries({ queryKey: ["tasks", selectedProject?.id] });
        return true;
      }
      return false;
    },
    [queryClient, selectedProject]
  );

  // Create a new task
  const handleCreateTask = useCallback(
    async (taskData) => {
      try {
        const newTaskData = await createTask(taskData);

        queryClient.setQueryData(["tasks", selectedProject?.id], (prev = []) => [
          ...prev,
          newTaskData.task
        ]);
        await queryClient.invalidateQueries({ queryKey: ["my-assigned-tasks"] });
      } catch (err) {
        setMutationError(err);
      }
    },
    [queryClient, selectedProject]
  );

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
        queryClient.setQueryData(["tasks", selectedProject?.id], (prev = []) =>
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

        await updateTask(taskId, { ...updates, updated_at: currentTask?.updated_at });
        await queryClient.invalidateQueries({ queryKey: ["my-assigned-tasks"] });
      } catch (err) {
        const isConflict = await handleConflict(err);
        if (!isConflict) setMutationError(err);
      }
    },
    [tasks, projectMembers, queryClient, selectedProject, handleConflict]
  );

  // Delete a task
  const handleDeleteTask = useCallback(
    async (taskId) => {
      try {
        queryClient.setQueryData(["tasks", selectedProject?.id], (prev = []) =>
          prev.filter((task) => task.id !== taskId)
        );

        await deleteTask(taskId);
        await queryClient.invalidateQueries({ queryKey: ["my-assigned-tasks"] });
      } catch (err) {
        setMutationError(err);
        await queryClient.invalidateQueries({ queryKey: ["tasks", selectedProject?.id] });
      }
    },
    [queryClient, selectedProject]
  );

  // Reorder tasks (for drag and drop in list view)
  const handleReorderTask = useCallback(
    async (taskId, newPosition) => {
      try {
        const currentTask = tasks.find((task) => task.id === taskId);

        await updateTask(taskId, { position: newPosition, updated_at: currentTask?.updated_at });
        await queryClient.invalidateQueries({ queryKey: ["tasks", selectedProject?.id] });
      } catch (err) {
        const isConflict = await handleConflict(err);
        if (!isConflict) setMutationError(err);
      }
    },
    [tasks, queryClient, selectedProject, handleConflict]
  );

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
