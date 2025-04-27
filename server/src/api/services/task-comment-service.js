import { StatusCodes } from "http-status-codes";
import taskCommentModel from "../models/task-comment-model.js";
import ApiError from "../../utils/api-error.js";


const createOneComment = async (data) => {
  try {
    const { task_id, user_id, content } = data;
    const commentId = await taskCommentModel.createOneComment({ task_id, user_id, content });


    if (!commentId) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create comment");
    }


    const comment = await taskCommentModel.getOneCommentById(commentId);
    return comment;
  } catch (err) {
    throw err;
  }
};


const getCommentsByTaskId = async (taskId) => {
  try {
    if (!taskId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Task ID is required");
    }


    const comments = await taskCommentModel.getCommentsByTaskId(taskId);
    return comments;
  } catch (err) {
    throw err;
  }
};


const updateOneComment = async (commentId, content) => {
  try {
    if (!commentId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Comment ID is required");
    }


    const updatedId = await taskCommentModel.updateOneCommentById(commentId, content);


    if (!updatedId) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Comment not found or update failed");
    }


    return await taskCommentModel.getOneCommentById(updatedId);
  } catch (err) {
    throw err;
  }
};


const deleteOneComment = async (commentId) => {
  try {
    if (!commentId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Comment ID is required");
    }


    await taskCommentModel.deleteOneCommentById(commentId);
    return commentId;
  } catch (err) {
    throw err;
  }
};


export default {
  createOneComment,
  getCommentsByTaskId,
  updateOneComment,
  deleteOneComment
};
