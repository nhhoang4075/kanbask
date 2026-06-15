import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/api-error.js";

import activityLogModel from "../models/activityLog-model.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneActivityLog = async (data) => {
  try {
    const allowedData = sanitizeAllowedFields(data, ["user_id", "action", "description"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    const log = await activityLogModel.createOneActivityLog(allowedData);

    if (!log) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create one activity log");
    }

    return log;
  } catch (err) {
    throw err;
  }
};

const getActivityLogsOfUser = async (user_id) => {
  try {
    const logs = await activityLogModel.getActivityLogsOfUser(user_id);

    return logs;
  } catch (err) {
    throw err;
  }
};

const getOneActivityLogById = async (id) => {
  try {
    const log = await activityLogModel.getOneActivityLogById(id);

    return log;
  } catch (err) {
    throw err;
  }
};

const deleteOneActivityLogById = async (id) => {
  try {
    await activityLogModel.deleteOneActivityLogById(id);
  } catch (err) {
    throw err;
  }
};

export default {
  createOneActivityLog,
  getActivityLogsOfUser,
  getOneActivityLogById,
  deleteOneActivityLogById
};
