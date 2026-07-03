import { StatusCodes } from "http-status-codes";

import taskActivityLogService from "../services/task-activity-log-service.js";

const getActivityLogsOfTask = async (req, res, next) => {
  try {
    const logs = await taskActivityLogService.getManyTaskActivityLogsByTaskId(
      req.query.task_id,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};

const getActivityLogsOfProjectTasks = async (req, res, next) => {
  try {
    const logs = await taskActivityLogService.getManyTaskActivityLogsByProjectId(
      req.query.project_id,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getActivityLogsOfTask,
  getActivityLogsOfProjectTasks
};
