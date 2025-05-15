import { StatusCodes } from "http-status-codes";
import activityLogService from "../services/activityLog-service.js";

const createOneActivityLog = async (req, res, next) => {
  try {
    const log = await activityLogService.createOneActivityLog(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: { log }
    });
  } catch (error) {
    return next(error);
  }
};

const getActivityLogsOfUser = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const logs = await activityLogService.getActivityLogsOfUser(user_id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: { logs }
    });
  } catch (error) {
    return next(error);
  }
};

const getOneActivityLogById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const log = await activityLogService.getOneActivityLogById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: { log }
    });
  } catch (error) {
    return next(error);
  }
};

const delteteOneActivityLogById = async (req, res, next) => {
  try {
    const id = req.params.id;

    await activityLogService.deleteOneActivityLogById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted successfully activity log with id ${id}`
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  createOneActivityLog,
  getActivityLogsOfUser,
  getOneActivityLogById,
  delteteOneActivityLogById
};
