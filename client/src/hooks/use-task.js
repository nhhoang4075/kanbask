import { useState } from 'react';
import { 
  createTask, 
  getProjectTasks, 
  updateTask, 
  deleteTask,
  uploadTaskAttachments,
  getTaskAttachmentUrl,
  deleteTaskAttachments 
} from '../actions/task-action.js';

export function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjectTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasks = await getProjectTasks(projectId);
      setTasks(tasks);
      return tasks;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData) => {
    try {
      setLoading(true);
      setError(null);
      const newTask = await createTask({
        project_id: projectId,
        ...taskData
      });
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (taskId, taskData) => {
    try {
      setLoading(true);
      setError(null);
      const message = await updateTask(taskId, taskData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...taskData } : task
      ));
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeTask = async (taskId) => {
    try {
      setLoading(true);
      setError(null);
      const message = await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachments = async (taskId, files) => {
    try {
      setLoading(true);
      setError(null);
      const message = await uploadTaskAttachments(taskId, files);
      // Refresh task list to get updated attachments
      await fetchProjectTasks();
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAttachmentUrl = async (taskId, attachmentId) => {
    try {
      setLoading(true);
      setError(null);
      const url = await getTaskAttachmentUrl(taskId, attachmentId);
      return url;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeAttachments = async (taskId, attachmentIds) => {
    try {
      setLoading(true);
      setError(null);
      const message = await deleteTaskAttachments(taskId, attachmentIds);
      // Refresh task list to get updated attachments
      await fetchProjectTasks();
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchProjectTasks,
    addTask,
    editTask,
    removeTask,
    uploadAttachments,
    getAttachmentUrl,
    removeAttachments
  };
}