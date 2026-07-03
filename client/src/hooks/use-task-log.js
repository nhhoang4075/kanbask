"use client";

import { createContext, useContext, useState, useCallback } from "react";

import { getActivityLogsOfTask } from "@/actions/task-activity-log-actions";

const TaskLogContext = createContext();

export function useTaskLog() {
  return useContext(TaskLogContext);
}

export function TaskLogProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async (taskId) => {
    try {
      setLoading(true);
      const data = await getActivityLogsOfTask(taskId);
      setLogs(data.logs);
    } catch (err) {
      setError(err);
    }
  }, []);

  const contextValue = {
    logs,
    loading,
    error,
    fetchLogs
  };

  return <TaskLogContext.Provider value={contextValue}>{children}</TaskLogContext.Provider>;
}
