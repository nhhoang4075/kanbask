"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

import { getTaskOfProject, createTask, updateTask, deleteTask } from "@/actions/task-actions";
import { useSocket } from "@/hooks/use-socket";

const TaskContext = createContext();

export function useTask() {
  return useContext(TaskContext);
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, active, completed

  const { socket, connected: socketConnected } = useSocket();

  const filterOptions = [
    { value: "all", label: "All Tasks" },
    { value: "active", label: "Active Tasks" },
    { value: "completed", label: "Completed Tasks" }
  ];

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTaskOfProject(selectedProjectId);
      setTasks(data.tasks);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  // Create a new task
  const handleCreateTask = useCallback(async (data) => {
    try {
      const newTask = await createTask(data);
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  // Update a task
  const handleUpdateTask = useCallback(async (taskId, updates) => {
    try {
      const updatedTask = await updateTask(taskId, updates);
      setTasks((prev) => prev.map((task) => (task.id === taskId ? updatedTask : task)));
      return updatedTask;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  // Delete a task
  const handleDeleteTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const contextValue = {
    tasks,
    selectedTeamId,
    selectedProjectId,
    setSelectedTeamId,
    setSelectedProjectId,
    loading,
    error,
    filterOptions,
    filter,
    setFilter,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask
  };

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
}
