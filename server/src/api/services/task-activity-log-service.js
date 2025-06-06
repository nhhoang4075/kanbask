import { StatusCodes } from "http-status-codes";

import taskActivityLogModel from "../models/task-activity-log-model.js";
import taskModel from "../models/task-model.js";
import projectModel from "../models/project-model.js";
import ApiError from "../../utils/api-error.js";

const getManyTaskActivityLogsByTaskId = async (taskId, actorId) => {
  try {
    const task = await taskModel.getOneTaskById(taskId);

    if (!task) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task not found");
    }

    const isProjectMember = await projectModel.isUserInProject(task.project_id, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const logs = await taskActivityLogModel.getManyTaskActivityLogsByTaskId(taskId);

    return logs;
  } catch (err) {
    throw err;
  }
};

const getManyTaskActivityLogsByProjectId = async (projectId, actorId) => {
  try {
    const isProjectMember = await projectModel.isUserInProject(projectId, actorId);

    if (!isProjectMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only members of project can access this");
    }

    const logs = await taskActivityLogModel.getManyTaskActivityLogsByProjectId(projectId);

    return logs;
  } catch (err) {
    throw err;
  }
};

export default {
  getManyTaskActivityLogsByTaskId,
  getManyTaskActivityLogsByProjectId
};
