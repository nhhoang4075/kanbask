import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/api-error";
import taskModel from "../models/task-model";

const createTask = async (project_id, title, status, priority, assignees, created_by, due_date) => {
  const task = await taskModel.createTask(
    project_id,
    title,
    status,
    priority,
    assignees,
    created_by,
    due_date
  );

  if (!task.id) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create a task");
  }

  return task;
};

const updateTask = async (task_id, title, status, priority, assignees, due_date) => {
  const task = await taskModel.updateTask(task_id, title, status, priority, assignees, due_date);

  if (!task.id) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update a task");
  }

  return task;
};

export default {
  createTask,
  updateTask
};
