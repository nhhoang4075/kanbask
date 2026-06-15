import { StatusCodes } from "http-status-codes";

import taskCommentModel from "../models/task-comment-model.js";
import ApiError from "../../utils/api-error.js";
import { sanitizeAllowedFields } from "../../utils/helper.js";

const createOneTaskComment = async (data) => {
  try {
    const { task_id, user_id, content } = data;

    const commentId = await taskCommentModel.createOneTaskComment({ task_id, user_id, content });

    if (!commentId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create the comment");
    }

    const comment = await taskCommentModel.getOneTaskCommentById(commentId);

    return comment;
  } catch (err) {
    throw err;
  }
};

const getManyTaskCommentsByTaskId = async (taskId) => {
  try {
    const comments = await taskCommentModel.getManyTaskCommentsByTaskId(taskId);

    return comments;
  } catch (err) {
    throw err;
  }
};

const updateOneTaskCommentById = async (id, updateData, actorId) => {
  try {
    const comment = await taskCommentModel.getOneTaskCommentById(id);

    if (comment.user_id == actorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only author of comment can access this");
    }

    const allowedData = sanitizeAllowedFields(updateData, ["content"]);

    if (Object.keys(allowedData).length === 0) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, "No allowed field to update");
    }

    await taskCommentModel.updateOneTaskCommentById(comment.id, allowedData);

    return comment.id;
  } catch (err) {
    throw err;
  }
};

const deleteOneTaskCommentById = async (id, actorId) => {
  try {
    const comment = await taskCommentModel.getOneTaskCommentById(id);

    if (comment.user_id == actorId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Only author of comment can access this");
    }

    await taskCommentModel.deleteOneTaskCommentById(comment.id);

    return comment.id;
  } catch (err) {
    throw err;
  }
};

export default {
  createOneTaskComment,
  getManyTaskCommentsByTaskId,
  updateOneTaskCommentById,
  deleteOneTaskCommentById
};
