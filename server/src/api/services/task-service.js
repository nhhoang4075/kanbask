import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/api-error.js";
import taskModel from "../models/task-model.js";

const createOneTask = async (project_id, title, status, priority, due_date, user_id, assignees) => {
  try {
    const position = await taskModel.getMaxTaskPosition(project_id);

    const task = await taskModel.createOneTask(
      project_id,
      title,
      status,
      priority,
      due_date,
      position + 1,
      user_id,
      assignees
    );

    if (!task.id) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create a task");
    }

    return task;
  } catch (err) {
    throw err;
  }
};

const getProjectTasks = async (project_id) => {
  try {
    const tasks = await taskModel.getProjectTasks(project_id);

    if (!tasks) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get tasks");
    }

    return tasks;
  } catch (err) {
    throw err;
  }
};

const getOneTaskById = async (task_id) => {
  try {
    const task = await taskModel.getOneTaskById(task_id);

    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
    }

    return task;
  } catch (err) {
    throw err;
  }
};

const updateOneTaskInfo = async (task_id, title, status, priority, due_date, assignees) => {
  try {
    const task = await taskModel.updateOneTaskInfo(
      task_id,
      title,
      status,
      priority,
      due_date,
      assignees
    );

    if (!task) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update a task");
    }

    return task;
  } catch (err) {
    throw err;
  }
};

const updateOneTaskPosition = async (task_id, position) => {
  try {
    const task = await getOneTaskById(task_id);

    await taskModel.updateOneTaskPosition(task.id, task.project_id, task.position, position);
  } catch (err) {
    throw err;
  }
};

const deleteOneTaskById = async (task_id) => {
  try {
    const task = await getOneTaskById(task_id);

    await taskModel.deleteOneTaskById(task_id, task.project_id, task.position);
  } catch (err) {
    throw err;
  }
};

export default {
  createOneTask,
  getProjectTasks,
  getOneTaskById,
  updateOneTaskInfo,
  updateOneTaskPosition,
  deleteOneTaskById
};
