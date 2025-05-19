import taskCommentService from "../services/task-comment-service.js";
import { StatusCodes } from "http-status-codes";

const createOneTaskComment = async (req, res, next) => {
  try {
    const comment = await taskCommentService.createOneTaskComment(req.body, req.user.id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: { comment }
    });
  } catch (err) {
    next(err);
  }
};

const getCommentsOfTask = async (req, res, next) => {
  try {
    const comments = await taskCommentService.getManyTaskCommentsByTaskId(
      req.query.task_id,
      req.user.id
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: { comments }
    });
  } catch (err) {
    next(err);
  }
};

const updateOneTaskCommentById = async (req, res, next) => {
  try {
    const commentId = await taskCommentService.updateOneTaskCommentById(
      req.params.id,
      req.body,
      req.user.id
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: `Updated successfully comment with id ${commentId}`
    });
  } catch (err) {
    next(err);
  }
};

const deleteOneTaskCommentById = async (req, res, next) => {
  try {
    const commentId = await taskCommentService.deleteOneTaskCommentById(req.params.id, req.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: `Deleted successfully comment with id ${commentId}`
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createOneTaskComment,
  getCommentsOfTask,
  updateOneTaskCommentById,
  deleteOneTaskCommentById
};
