import { StatusCodes } from "http-status-codes";
import taskService from "../services/task-service.js";

const createOneTask = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const task = await taskService.createOneTask(user_id, req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectTasks = async (req, res, next) => {
  try {
    const { project_id } = req.body;
    const tasks = await taskService.getProjectTasks(project_id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { tasks }
    });
  } catch (error) {
    throw next(error);
  }
};

const getOneTaskById = async (req, res, next) => {
  try {
    const { task_id } = req.params;

    const task = await taskService.getOneTaskById(task_id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    throw next(error);
  }
};

const updateOneTaskById = async (req, res, next) => {
  try {
    const { task_id } = req.params;

    const task = await taskService.updateOneTaskById(task_id, req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Task ${task_id} is updated successfully`,
      data: { task }
    });
  } catch (error) {
    return next(error);
  }
};

const deleteOneTaskById = async (req, res, next) => {
  try {
    const { task_id } = req.params;

    await taskService.deleteOneTaskById(task_id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Delete task ${task_id} successfully`
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  createOneTask,
  getProjectTasks,
  getOneTaskById,
  updateOneTaskById,
  deleteOneTaskById
};
