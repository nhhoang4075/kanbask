import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/api-error.js";
import taskModel from "../models/task-model.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneTask = async (user_id, data) => {
  try {
    const allowedData = sanitizeAllowedFields(data, [
      "project_id",
      "title",
      "status",
      "priority",
      "due_date"
    ]);

    const assignees = data.assignees;

    const position = await taskModel.getMaxTaskPosition(allowedData.project_id);

    const task = await taskModel.createOneTask(user_id, allowedData, position + 1, assignees);

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

const updateOneTaskById = async (task_id, data) => {
  try {
    const allowedData = sanitizeAllowedFields(data, ["title", "status", "priority", "due_date"]);

    let task = await taskModel.updateOneTaskById(task_id, allowedData, data.assignees);

    if (!task) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Task not found");
    }

    if (data.position != null && task.position != data.position)
      task = await taskModel.moveTask(task.id, task.project_id, task.position, data.position);

    return task;
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
  updateOneTaskById,
  deleteOneTaskById
};
