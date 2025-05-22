"use client";

import { createContext, useContext, useRef, useState } from "react";
import { columnDefinitions, initialData } from "@/data/tasks";

// Create the context
const TaskContext = createContext(null);

// Provider component
export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(initialData);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(initialData[0]);

  const editModeRef = useRef(false);

  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      projectId: taskData.projectId,
      title: taskData.title,
      description: taskData.description,
      status: "To Do",
      priority: taskData.priority,
      createdBy: {
        id: "user-1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40"
      },
      assignedTo: taskData.assignedTo || [],
      dueDate: taskData.dueDate,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: taskData.attachments || []
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };

  // Update an existing task
  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,
              ...updatedTask,
              updatedAt: new Date().toISOString(),
              // If moving to Done, set completedAt
              ...(updatedTask.status === "Done" && !task.completedAt
                ? { completedAt: new Date().toISOString() }
                : {}),
              // If moving from Done to another status, clear completedAt
              ...(task.status === "Done" && updatedTask.status !== "Done"
                ? { completedAt: null }
                : {})
            }
          : task
      )
    );

    return updatedTask;
  };

  // Delete a task
  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);

    if (!taskToDelete) return;

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Move a task between columns
  const moveTask = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              // If moving to Done, set completedAt
              ...(newStatus === "Done" && !task.completedAt
                ? { completedAt: new Date().toISOString() }
                : {}),
              // If moving from Done to another status, clear completedAt
              ...(task.status === "Done" && newStatus !== "Done" ? { completedAt: null } : {})
            }
          : task
      )
    );
  };

  // Add a comment to a task
  const addComment = (taskId, comment) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              comments: [...(task.comments || []), comment],
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );

    return comment;
  };

  // Add a file attachment to a task
  const addFileAttachment = (taskId, file) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              attachments: [...(task.attachments || []), file],
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );

    return file;
  };

  // Delete a file attachment from a task
  const deleteFileAttachment = (taskId, fileId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              attachments: (task.attachments || []).filter((file) => file.id !== fileId),
              updatedAt: new Date().toISOString()
            }
          : task
      )
    );
  };

  // Get tasks filtered by project and search term
  const getFilteredTasks = (projectId, searchTerm = "") => {
    return tasks.filter(
      (task) =>
        task.projectId === projectId &&
        (searchTerm
          ? task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    );
  };

  // Reorder tasks (for drag and drop in list view)
  const reorderTasks = (reorderedTasks) => {
    const reorderedIds = new Set(reorderedTasks.map((task) => task.id));
    const otherTasks = tasks.filter((task) => !reorderedIds.has(task.id));
    setTasks([...reorderedTasks, ...otherTasks]);
  };

  // Context value
  const value = {
    tasks,
    selectedTask,
    setSelectedTask,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addComment,
    addFileAttachment,
    deleteFileAttachment,
    getFilteredTasks,
    reorderTasks,
    isTaskDetailsOpen,
    setIsTaskDetailsOpen,
    editModeRef
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Custom hook to use the context
export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
}
