import { StatusCodes } from "http-status-codes";
import taskService from "../services/task-service.js";

const createOneTask = async (req, res, next) => {
  try {
    const task = await taskService.createOneTask(req.body, req.user.id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

const getTasksOfProject = async (req, res, next) => {
  try {
    const tasks = await taskService.getManyTasksByProjectId(req.query.project_id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

const getMyAssignedTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getAssignedTasksByUserId(req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    next(error);
  }
};

const updateOneTaskById = async (req, res, next) => {
  try {
    const taskId = await taskService.updateOneTaskById(req.params.id, req.body, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Updated successfully task with id ${taskId}`
    });
  } catch (error) {
    next(error);
  }
};

const deleteOneTaskById = async (req, res, next) => {
  try {
    const taskId = await taskService.deleteOneTaskById(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Delete successfully task with id ${taskId}`
    });
  } catch (error) {
    next(error);
  }
};

const uploadAttachmentsToTask = async (req, res, next) => {
  try {
    const attachments = await taskService.uploadAttachmentsToTask(
      req.params.id,
      req.files,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      // message: `Upload successfully attachments to task with id ${req.params.id}`,
      data: { attachments }
    });
  } catch (error) {
    next(error);
  }
};

const getAttachmentsOfTask = async (req, res, next) => {
  try {
    const attachments = await taskService.getManyAttachmentsByTaskId(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { attachments }
    });
  } catch (error) {
    next(error);
  }
};

const deleteAttachmentsFromTask = async (req, res, next) => {
  try {
    const taskId = await taskService.deleteAttachmentsFromTask(
      req.params.id,
      req.body.attachment_ids,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Delete successfully attachments from task with id ${taskId}`
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOneTask,
  getTasksOfProject,
  getMyAssignedTasks,
  updateOneTaskById,
  deleteOneTaskById,
  uploadAttachmentsToTask,
  getAttachmentsOfTask,
  deleteAttachmentsFromTask
};
