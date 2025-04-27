import { StatusCodes } from "http-status-codes";
import taskService from "../services/task-service";

const createTask = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { project_id, title, status, priority, assignees, due_date } = req.body;

    const task = await taskService.createTask(
      project_id,
      title,
      status,
      priority,
      assignees,
      user_id,
      due_date
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { task_id } = req.params;
    const user_id = req.user.id;
    const { title, status, priority, assignees, due_date } = req.body;

    const task = await taskService.updateTask(
      task_id,
      title,
      status,
      priority,
      assignees,
      due_date
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  createTask,
  updateTask
};
